import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { User } from './schemas/users.schema';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService){}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto){
    this.userService.signup(createUserDto);
  }

  @Post('/login')
  async login(@Body() loginUserDto: LoginUserDto) {
    this.userService.login(loginUserDto.email, loginUserDto.password);
  }

  @Get()
  async getUsers(): Promise<User[]> {
    return this.userService.getUsers()
  }
}