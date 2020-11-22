import { Controller, Get, Post, Patch, Delete, HttpCode, Param, Body, UseGuards } from '@nestjs/common';
import { Task } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { TasksService } from './tasks.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';


@Controller('api/tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private tasksService: TasksService){}

  @Post()
  @HttpCode(201)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    this.tasksService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(): Promise<Task[]> {
    return this.tasksService.getTasks()
  }

  @Get(':id')
  async getTasksById(@Param('id') id:string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  async updateTask(@Param('id') id: string, @Body() updateTasksDto: UpdateTaskDto) {
    this.tasksService.updateTask(id, updateTasksDto)
  }

  @Delete('/:id')
  async deleteTask(@Param('id') id: string) {
    this.tasksService.deleteTask(id);
  }
}
