import { Controller, Get, Post, Patch, Delete, HttpCode, Param, Body, UseGuards, Req, HttpException, HttpStatus } from '@nestjs/common';
import { Task } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.schema';

export interface IUserInfo extends Request{
  user: {
    email: string,
    userId: string
  }
}

@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(
    private tasksService: TasksService,
    private usersService: UsersService
  ){}

  @Post()
  @HttpCode(201)
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: IUserInfo) {
    let user: UserDocument
    try {
      user = await this.usersService.findUserById(req.user.userId)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'エラーが発生しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      await this.tasksService.createTask(createTaskDto, user);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'タスクの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async getTasks(): Promise<Task[]> {
    try {
      return this.tasksService.getTasks()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }

  @Get(':id')
  async getTasksById(@Param('id') id:string): Promise<Task> {
    try {
      return this.tasksService.getTaskById(id);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('/:id')
  async updateTask(@Param('id') id: string, @Body() updateTasksDto: UpdateTaskDto) {
    try {
      await this.tasksService.updateTask(id, updateTasksDto)
    } catch(err) {
      if (err.message === 'could not find a task') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'タスクの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if (err.message === 'failed update') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'タスクの更新に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    try {
      await this.tasksService.deleteTask(id);
    } catch(err) {
      if (err.message === 'could not find a task') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'タスクの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if (err.message === 'failed delete') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'タスクの削除に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
