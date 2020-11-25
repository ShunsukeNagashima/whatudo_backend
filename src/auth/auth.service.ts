import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { compare } from 'bcryptjs';
import { User, UserDocument } from '../users/schemas/users.schema'
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ){}

  async validateUser(email: string, password: string): Promise<any> {

    let existingUser: User
    try {
      existingUser = await this.usersService.findUserByEmail(email)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'ユーザーの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    if (!existingUser) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'ユーザーが存在しません。'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }

    let isValidPassword: boolean;
    try {
      isValidPassword = await compare(password, existingUser.password)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'エラーが発生しました。もう一度お試しください。'
      }, HttpStatus.UNAUTHORIZED);
    }

    if (!isValidPassword) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: '不正なパスワードです。'
      }, HttpStatus.UNAUTHORIZED);
    }

    return existingUser
  }

  async login(user: UserDocument) {
    const payload = { email: user.email, sub: user.id};
    return {
      access_token: this.jwtService.sign(payload, { secret: process.env.JWT_KEY })
    };
  }

}
