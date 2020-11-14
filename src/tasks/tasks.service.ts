import {Injectable}from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common';
import {ITask} from './interfaces/task.interface';


@Injectable()
export class TasksService {
  private readonly tasks: ITask[] = [];

  createTask(task: ITask) {
    this.tasks.push(task);
  }

  getTasks(): ITask[] {
    return this.tasks;
  }

  getTaskById(id: string): ITask {

    const task =  this.tasks.find(t => t.id == id);

    if (!task) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではタスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return task
  }

  updateTask(id: string, task:ITask) {
    const taskIndex = this.tasks.findIndex(t => t.id == id);
    let identifiedTask = this.tasks[taskIndex];

    if (!identifiedTask) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではタスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    this.tasks[taskIndex] = task
  }

  deleteTask(id: string): string {
    this.tasks.filter(t => t.id != id);

    return "削除しました。"
  }
}
