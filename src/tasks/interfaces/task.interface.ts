export interface ITask {
  id: string,
  categoryId: string,
  projectId: string,
  groupId: string,
  description: string,
  limitDate: Date,
  progress: number,
  memos: string[],
  creator: string
  pic: string
}
