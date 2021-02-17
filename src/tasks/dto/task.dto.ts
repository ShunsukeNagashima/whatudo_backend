import { IsNotEmpty } from 'class-validator'
import { CreateCommentDto } from '../../comments/dto/comments.dto'

export class CreateTaskDto {
  @IsNotEmpty()
  title: string
  description: string
  limitDate: Date
  status: string
  progress: number
  comments: string[]
  creator: string
  personInCharge: string
  category: string
  project: string
}

export class UpdateTaskDto {
  @IsNotEmpty()
  title: string
  description: string
  limitDate: Date
  status: string
  progress: number
  comment: CreateCommentDto
  modifiedBy: string[]
  personInCharge: string
  category: string
}
