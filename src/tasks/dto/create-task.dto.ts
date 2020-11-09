export class CreateTaskDto {
  id: string;
  categoryId: string;
  projectId: string;
  groupId: string;
  description: string;
  limitDate: Date;
  progress: number;
  memos: string[];
  creator: string;
  pic: string;
}

export class UpdateTasksDto {
  categoryId: string;
  projectId: string;
  groupId: string;
  description: string;
  limitDate: Date;
  progress: number;
  memos: string[];
  pic: string;
}