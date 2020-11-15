import { IsNotEmpty } from 'class-validator';

export class CreateCommetnDto {
  @IsNotEmpty()
  title: string;
  detail: string;
  creator: string;
}

export class UpdateCommentDto {
  @IsNotEmpty()
  title: string;
  detail: string;
}