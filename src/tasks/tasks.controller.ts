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
  UseGuards,
  Query
} from '@nestjs/common';
import { Task } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Request } from 'express';
import { UsersService } from '../users/users.service';
import { ProjectsService } from '../projects/projects.service';

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
    const user = await this.usersService.findUserById(req.user.userId)
    const project = await this.projectsService.findProjectsById(createTaskDto.project)
    await this.tasksService.createTask(createTaskDto, user, project);
    return { message: 'タスクを作成しました。'}
  }

  @Get()
  async getTasksByProjectId(@Query('projectId') projectId:string) {
    return this.tasksService.getTasksByProjectId(projectId)
  }

  @Get('/:id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Get('/task/:taskId')
  async getTaskByTaskId(@Param('taskId') taskId: number, @Query('projectId') projectId: string): Promise<Task> {
    return this.tasksService.getTaskByTaskId(taskId, projectId);
  }

  @Get('/user/dashboard')
  async getTasksByUserId(@Req() req: IUserInfo) {
    return this.tasksService.getTasksByUserId(req.user.userId)
  }

  @Patch('/task/:taskId')
  async updateTask(@Param('taskId') taskId: number, @Query('projectId') projectId: string,@Req() req: IUserInfo, @Body() updateTasksDto: UpdateTaskDto) {
    const user = await this.usersService.findUserById(req.user.userId)
    const updatedTask = await this.tasksService.updateTask(taskId, projectId, user, updateTasksDto)
    return { task: updatedTask, message: 'タスクを更新しました。'}
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    await this.tasksService.deleteTask(id);
    return { message: 'タスクを削除しました。'}
  }
}
