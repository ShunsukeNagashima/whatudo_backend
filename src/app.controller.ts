import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request as Req } from 'express'
import { User } from './users/schemas/users.schema';

interface AuthInfoRequest extends Req {
  user: User
}

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('/api/auth/login')
  async login(@Request() req: AuthInfoRequest) {
    return req.user;
  }

}
