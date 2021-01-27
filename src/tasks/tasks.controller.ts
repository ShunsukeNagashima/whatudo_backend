import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode,
  Param,
  Body,
  Req,
  HttpException,
  HttpStatus,
  UseGuards,
  Query
} from '@nestjs/common';
import { Task, TaskDocument } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.schema';
import { ProjectsService } from '../projects/projects.service';
import { ProjectDocument } from '../projects/schemas/projects.schema';

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
    private usersService: UsersService,
    private projectsService: ProjectsService
  ){}

  @Post()
  @HttpCode(201)
  async createTask(@Body() createTaskDto: CreateTaskDto, @Req() req: IUserInfo) {
    let user: UserDocument
    let project: ProjectDocument

    try {
      user = await this.usersService.findUserById(req.user.userId)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'エラーが発生しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      project = await this.projectsService.findProjectsById(createTaskDto.project)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'エラーが発生しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      await this.tasksService.createTask(createTaskDto, user, project);
      return { message: 'タスクを作成しました。'}
    } catch(err) {
      if (err.message === 'auto increment failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: '自動採番に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'タスクの作成に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

  @Get()
  async getTasksByProjectId(@Query('projectId') projectId:string) {
    try {
      return this.tasksService.getTasksByProjectId(projectId);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {

    try {
      return this.tasksService.getTaskById(id);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/task/:taskId')
  async getTaskByTaskId(@Param('taskId') taskId: number, @Query('projectId') projectId: string): Promise<Task> {

    try {
      return this.tasksService.getTaskByTaskId(taskId, projectId);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/user/dashboard')
  async getTasksByUserId(@Req() req: IUserInfo) {
    try {
      const tasks =  await this.tasksService.getTasksByUserId(req.user.userId)
      return { tasks }
    } catch(err) {
      throw new HttpException({
        statsu: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('/task/:taskId')
  async updateTask(@Param('taskId') taskId: number, @Query('projectId') projectId: string,@Req() req: IUserInfo, @Body() updateTasksDto: UpdateTaskDto) {
    let updatedTask: TaskDocument
    let user: UserDocument

    try {
      user = await this.usersService.findUserById(req.user.userId)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'ユーザの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      updatedTask =  await this.tasksService.updateTask(taskId, projectId, user, updateTasksDto)
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
    return { task: updatedTask, message: 'タスクを更新しました。'}
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
    return { message: 'タスクを削除しました。'}
  }
}
