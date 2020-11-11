export class CreateTaskDto {
  id: string;
  title: string;
  description: string;
  limitDate: Date;
  progress: number;
  memos: string[];
  creator: string;
  pic: string;
  categoryId: string;
  projectId: string;
  groupId: string;
}

export class UpdateTasksDto {
  title: string;
  description: string;
  limitDate: Date;
  progress: number;
  categoryId: string;
  groupId: string;
  memos: string[];
  pic: string;
}