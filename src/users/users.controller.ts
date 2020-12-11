import { Body, Controller, Post, Get, Param, HttpException, HttpStatus } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UserDocument } from './schemas/users.schema';
import { UsersService } from './users.service';
import { AuthService } from '../auth/auth.service';

@Controller('api/users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ){}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto){

    let user: UserDocument
    try {
      user = await this.userService.signup(createUserDto)
    } catch(err) {
      if (err.message === 'signup failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'サインアップに失敗しました。再度お試しください。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if(err.message === 'already exists') {
        throw new HttpException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          error: 'ユーザーは既に存在します。ログインしてください。'
        }, HttpStatus.UNPROCESSABLE_ENTITY)
      }
    }

    try {
      return this.authService.login(user)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'エラーが発生しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/:id')
  async findUserById(@Param('id') id: string ): Promise<UserDocument | void> {
    try {
      return this.userService.findUserById(id);
    } catch(err) {
      if (err.message === 'could not find a user') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'ユーザーの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

}
