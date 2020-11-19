import { Injectable, InternalServerErrorException, UnauthorizedException} from '@nestjs/common';
import { compare } from 'bcryptjs';
import { User } from '../users/schemas/users.schema'
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {
  constructor(private usersService: UsersService){}

  async validateUser(email: string, password: string): Promise<any> {

    let existingUser: User
    try {
      existingUser = await this.usersService.findUserByEmail(email)
    } catch(err) {
      throw new InternalServerErrorException();
    }

    if (!existingUser) {
      throw new InternalServerErrorException();
    }

    let isValidPassword: boolean;
    try {
      isValidPassword = await compare(password, existingUser.password)
    } catch(err) {
      throw new UnauthorizedException();
    }

    if (!isValidPassword) {
      throw new UnauthorizedException();
    }

    return existingUser
  }

}
