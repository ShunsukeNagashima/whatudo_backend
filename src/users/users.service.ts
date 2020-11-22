import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "サインアップに失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (existingUser) {
      throw new HttpException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        error: 'すでに存在します。ログインしてください。'
      }, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    let hashedPassword;
    try {
      hashedPassword = await hash(user.password, 12)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "サインアップに失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    user.password = hashedPassword
    const createdUser = new this.userModel(user)

    try {
      return createdUser.save()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "サインアップに失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findUserByEmail(email: string) : Promise<User> {
    try {
      return this.userModel.findOne({email}).exec()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "ユーザーの取得に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
