import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { Request as Req } from 'express'
import { UserDocument } from './users/schemas/users.schema';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

interface AuthInfoRequest extends Req {
  user: UserDocument
}

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/api/auth/login')
  async login(@Request() req: AuthInfoRequest) {
    return this.authService.login(req.user);
  }

}
