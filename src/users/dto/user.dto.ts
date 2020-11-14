import { IsNotEmpty, IsEmail, MinLength } from 'class-validator'
import { ITask } from 'src/tasks/interfaces/task.interface';

export class CreateUserDto {
  id: string;
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @IsNotEmpty()
  @MinLength(6)
  password: string;
  tasks: ITask[]
}

export class LoginUserDto {
  email: string;
  password: string;
}