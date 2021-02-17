import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  HttpCode,
} from '@nestjs/common'
import { CreateUserDto } from './dto/user.dto'
import { UsersService } from './users.service'
import { AuthService } from '../auth/auth.service'

@Controller('api/users')
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService
  ) {}

  @Post('/signup')
  @HttpCode(201)
  async signup(
    @Body() createUserDto: CreateUserDto,
    @Query('token') token: string
  ) {
    let message: string
    const user = await this.userService.signup(createUserDto)
    const userObj = await this.authService.login(user, token)
    if (token) {
      message = `${userObj.project.name}に参加しました。`
    } else {
      message = 'ログインしました。'
    }

    return { userObj, message }
  }

  @Get('/:projectId')
  async getUsersByProjectId(@Param('projectId') projectId: string) {
    return this.userService.findUsersByProjectId(projectId)
  }
}
