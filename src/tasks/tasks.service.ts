import {Model} from 'mongoose';
import {Injectable}from '@nestjs/common'
import {InjectModel} from '@nestjs/mongoose'
import {Task, TaskDocument} from './schemas/tasks.schema';
import {HttpException, HttpStatus} from '@nestjs/common';
import {CreateTaskDto, UpdateTasksDto} from './dto/task.dto';


@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>){}

  async createTask(createTaskDto: CreateTaskDto){
    const createdTask = new this.taskModel(createTaskDto);

    try {
      return createdTask.save();
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "タスクを作成できませんでした。再度お試しください。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }


  async getTasks(): Promise<Task[]> {
    try {
      return this.taskModel.find().exec()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "タスクの取得に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTaskById(id: string): Promise<Task> {

    let task: Promise<TaskDocument>;
    try {
      task =  this.taskModel.findById(id).exec()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "エラーが発生しました。タスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!task) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではタスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return task
  }

  async updateTask(id: string, updateTaskDto:UpdateTasksDto) {
    let task: TaskDocument

    try {
      task = await this.taskModel.findById(id);
    } catch(err){

    }

    if (!task) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではタスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    task.title = updateTaskDto.description
    task.description = updateTaskDto.description
    task.limitDate = updateTaskDto.limitDate
    task.progress = updateTaskDto.progress
    task.memos = updateTaskDto.memos
    task.modifiedBy = updateTaskDto.modifiedBy
    task.pic = updateTaskDto.pic
    task.categoryId = updateTaskDto.categoryId
    task.groupId = updateTaskDto.groupId
    task.updatedAt = updateTaskDto.updatedAt

    try {
      task.save()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "タスクの更新に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteTask(id: string) {
    let task: TaskDocument

    try {
     task = await this.taskModel.findById(id);
    } catch(err){

    }

    if (!task) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではタスクを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      task.remove()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "タスクの削除に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
