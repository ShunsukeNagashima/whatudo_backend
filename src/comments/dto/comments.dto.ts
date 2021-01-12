import { IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
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