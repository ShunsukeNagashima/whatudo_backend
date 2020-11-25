import { Model }  from 'mongoose';
import { Injectable }from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Task, TaskDocument } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { UserDocument } from '../users/schemas/users.schema';

@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>){}

  async createTask(createTaskDto: CreateTaskDto, user: UserDocument): Promise<void>{
    createTaskDto.creator = user.id
    createTaskDto.createdAt = new Date()

    const createdTask = new this.taskModel(createTaskDto);

    try {
      const sess = await this.taskModel.db.startSession();
      sess.startTransaction();
      await createdTask.save({ session: sess });
      user.tasks.push(createdTask.id)
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch(err) {
      return Promise.reject(new Error('create failed'))
    }
  }

  async getTasks(): Promise<TaskDocument[]> {
    try {
      return this.taskModel.find().exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a task'))
    }
  }

  async getTaskById(id: string): Promise<TaskDocument> {

    let task: TaskDocument;
    try {
      task =  await this.taskModel.findById(id).exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }
    return task
  }

  async updateTask(id: string, updateTaskDto:UpdateTaskDto) {
    let task: TaskDocument

    try {
      task = await this.taskModel.findById(id);
    } catch(err){
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }

    task.title = updateTaskDto.description
    task.description = updateTaskDto.description
    task.limitDate = updateTaskDto.limitDate
    task.progress = updateTaskDto.progress
    task.comments = updateTaskDto.comments
    task.modifiedBy = updateTaskDto.modifiedBy
    task.pic = updateTaskDto.pic
    task.categoryId = updateTaskDto.categoryId
    task.groupId = updateTaskDto.groupId
    task.updatedAt = updateTaskDto.updatedAt

    try {
      return task.save()
    } catch(err) {
      return Promise.reject(new Error('failed update'))
    }
  }

  async deleteTask(id: string) {
    let task: TaskDocument

    try {
     task = await this.taskModel.findById(id);
    } catch(err){
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }

    try {
      return task.remove()
    } catch(err) {
      return Promise.reject(new Error('delete failed'))
    }
  }
}
