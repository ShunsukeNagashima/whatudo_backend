import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IUser } from './interface/user.interface';

@Injectable()
export class UsersService {
  private readonly users: IUser[] = [];

  signup(user: IUser) {
    this.users.push(user);
  }

  login(email: string, password: string) {

    const existingUser = this.users.find(u => u.email == email);

    if (!existingUser) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'ログインに失敗しました。もう一度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (existingUser.password != password) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        error: 'ログインに失敗しました。もう一度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    console.log('ログインに成功しました。')
  }

  getUsers(): IUser[] {
    return this.users;
  }

}
