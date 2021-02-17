import { IsNotEmpty, IsEmail, MinLength } from 'class-validator'

export class CreateUserDto {
  id: string
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  @IsEmail()
  email: string
  @IsNotEmpty()
  @MinLength(6)
  password: string
  tasks: string[]
}
