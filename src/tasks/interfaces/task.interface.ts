export interface ITask {
  id?: string,
  title: string,
  description: string,
  limitDate: Date,
  progress: number,
  memos: string[],
  creator?: string,
  modifiedBy?: string[],
  pic: string,
  categoryId: string,
  projectId?: string,
  groupId: string,
  createdAt?: Date,
  updatedAt?: Date
}
