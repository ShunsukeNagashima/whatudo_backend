import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  description: string;
  limitDate: Date;
  progress: number;
  comments: string[];
  @IsNotEmpty()
  creator: string;
  pic: string;
  categoryId: string;
  projectId: string;
  groupId: string;
  @IsNotEmpty()
  createdAt: Date
}

export class UpdateTaskDto {
  @IsNotEmpty()
  title: string;
  description: string;
  limitDate: Date;
  progress: number;
  comments: string[];
  modifiedBy: string[];
  pic: string;
  categoryId: string;
  groupId: string;
  @IsNotEmpty()
  updatedAt: Date
}