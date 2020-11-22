import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/user.dto';
import { UsersService } from './users.service';

@Controller('api/users')
export class UsersController {
  constructor(private userService: UsersService){}

  @Post('/signup')
  async signup(@Body() createUserDto: CreateUserDto){
    this.userService.signup(createUserDto);
  }

}
