import { IsNotEmpty } from "class-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;
  description: string;
  limitDate: string;
  status: string;
  progress: number;
  comments: string[];
  creator: string;
  personInCharge: string;
  category: string;
  project: string;
}

export class UpdateTaskDto {
  @IsNotEmpty()
  title: string;
  description: string;
  limitDate: string;
  status: string;
  progress: number;
  comments: string[];
  modifiedBy: string[];
  personInCharge: string;
  categoryId: string;
}