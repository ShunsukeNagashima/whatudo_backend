import { Controller, Get, Post, Req, UseGuards, Query } from '@nestjs/common';
import { Request } from 'express'
import { UserDocument } from './users/schemas/users.schema';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { AuthService } from './auth/auth.service';

interface AuthInfoRequest extends Request {
  user: UserDocument
}

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Req() req: AuthInfoRequest, @Query('token') token: string) {
    let message;
    let userObj;
    try {
      userObj = await this.authService.login(req.user, token);
      console.log(userObj);
    } catch(err) {
      throw err
      // throw new HttpException({
      //   status: err.status,
      //   message: err.message
      // }, err.status);
    }
    if (token) {
      message = `${userObj.project.name}に参加しました。`
    } else {
      message = 'ログインしました。'
    }
    return { userObj, message }
  }

  @UseGuards(JwtAuthGuard)
  @Get('/api/profile')
  getProfile(@Req() req: AuthInfoRequest) {
    return req.user;
  }
}
