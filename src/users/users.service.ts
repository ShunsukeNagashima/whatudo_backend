import { Model } from 'mongoose'
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { hash } from 'bcryptjs'

import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

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
      return this.userModel.findOne({email}).exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a user'))
    }
  }

  async findUserById(id: string) : Promise<UserDocument> {
    try {
      return this.userModel.findById(id).exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a user'))
    }
  }

}
