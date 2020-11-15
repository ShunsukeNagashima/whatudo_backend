import { Model } from 'mongoose'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/users.schema';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>){}

  async signup(user: CreateUserDto) {
    const createdUser = new this.userModel(user)

    try {
      return createdUser.save()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "ユーザーの作成に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async login(email: string, password: string) {

    let existingUser: UserDocument;

    try {
      existingUser = await this.userModel.findOne({ email })
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'ログインに失敗しました。もう一度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!existingUser) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'ユーザー名またはパスワードが間違っています。'
      }, HttpStatus.UNAUTHORIZED)
    }

    if (existingUser.password != password) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'ユーザー名またはパスワードが間違っています。'
      }, HttpStatus.UNAUTHORIZED)
    }

   return 'ログインに成功しました。'
  }

  async getUsers(): Promise<User[]> {
    try {
      return this.userModel.find().exec()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "ユーザーの取得に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
