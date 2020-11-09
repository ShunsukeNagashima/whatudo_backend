import { Injectable } from '@nestjs/common';
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
    return this.tasks.find(t => t.id = id);
  }

  updateTask(id: string, task:ITask) {
    const taskIndex = this.tasks.findIndex(t => t.id = id);
    this.tasks[taskIndex] = task;
  }

  deleteTask(id: string): void {
    this.tasks.filter(t => t.id != id);
  }
}
