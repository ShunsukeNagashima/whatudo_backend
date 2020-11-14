import {ITask} from '../../tasks/interfaces/task.interface'

export interface IUser {
  id?: string;
  name?: string;
  email: string;
  password: string;
  tasks?: ITask[]
}