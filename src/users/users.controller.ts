import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto/user.dto';
import { IUser } from './interface/user.interface';
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
  async getUsers(): Promise<IUser[]> {
    return this.userService.getUsers()
  }
}
