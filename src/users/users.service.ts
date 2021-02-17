import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { hash } from 'bcryptjs'

import { User, UserDocument } from './schemas/users.schema'
import { CreateUserDto } from './dto/user.dto'
import { Project, ProjectDocument } from '../projects/schemas/projects.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
  ) {}

  async signup(user: CreateUserDto) {
    let existingUser: UserDocument
    try {
      existingUser = await this.userModel.findOne({ email: user.email })
    } catch (err) {
      throw new HttpException(
        {
          message: 'サインアップに失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    if (existingUser) {
      throw new HttpException(
        {
          message: '既に登録済みです。ログインしてください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    let hashedPassword
    try {
      hashedPassword = await hash(user.password, 12)
    } catch (err) {
      throw new HttpException(
        {
          message: 'サインアップに失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    user.password = hashedPassword
    const createdUser = new this.userModel(user)

    try {
      return createdUser.save()
    } catch (err) {
      throw new HttpException(
        {
          message: 'サインアップに失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findUserByEmail(email: string): Promise<User> {
    try {
      const user = await this.userModel
        .findOne({ email })
        .populate({
          path: 'projects',
          populate: { path: 'users', select: 'name' },
        })
      return user
    } catch (err) {
      throw new HttpException(
        {
          message: 'ユーザーの取得に失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findUserById(id: string): Promise<UserDocument> {
    try {
      return await this.userModel.findById(id, '-passowrd')
    } catch (err) {
      throw new HttpException(
        {
          message: 'ユーザーの取得に失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async findUsersByProjectId(pid: string) {
    try {
      const project = await this.projectModel.findById(pid).populate('users')
      return project.users.map((u) => {
        return {
          id: u._id,
          name: u.name,
        }
      })
    } catch (err) {
      throw new HttpException(
        {
          message: 'ユーザーの取得に失敗しました。再度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
