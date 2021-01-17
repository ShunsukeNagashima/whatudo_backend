import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs'

import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/user.dto';
import { Project, ProjectDocument } from '../projects/schemas/projects.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ){}

  async signup(user: CreateUserDto) {

    let existingUser: UserDocument;
    try {
      existingUser = await this.userModel.findOne({email: user.email})
    } catch(err) {
      return Promise.reject(new Error('signup failed'))
    }

    if (existingUser) {
      return Promise.reject(new Error('already exists'))
    }

    let hashedPassword;
    try {
      hashedPassword = await hash(user.password, 12)
    } catch(err) {
      return Promise.reject(new Error('signup failed'))
    }

    user.password = hashedPassword
    const createdUser = new this.userModel(user)

    try {
      return createdUser.save()
    } catch(err) {
      return Promise.reject(new Error('signup failed'))
    }
  }

  async findUserByEmail(email: string) : Promise<User> {
    try {
      const user = await this.userModel.findOne({email}).populate('projects')
      return user
    } catch(err) {
      return Promise.reject(new Error('could not find a user'))
    }
  }

  async findUserById(id: string) : Promise<UserDocument> {
    try {
      return await this.userModel.findById(id, '-passowrd')
    } catch(err) {
      return Promise.reject(new Error('could not find a user'))
    }
  }

  async findUsersByProjectId(pid: string) {
    try {
      const project = await this.projectModel.findById(pid).populate('users')
      return project.users.map(u => {
        return {
          id: u._id,
          name: u.name
        }
      })
    }catch(err) {
      return Promise.reject('could not find users by given projectId')
    }
  }
}
