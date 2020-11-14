import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  HttpCode ,
  Param,
  Body
} from '@nestjs/common';
import { ITask } from './interfaces/task.interface'
import { CreateTaskDto, UpdateTasksDto } from './dto/create-task.dto';
import { TasksService } from './tasks.service'


@Controller('api/tasks')
export class TasksController {
  constructor(private tasksService: TasksService){}

  @Post()
  @HttpCode(201)
  async createTask(@Body() createTaskDto: CreateTaskDto) {
    this.tasksService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(): Promise<ITask[]> {
    return this.tasksService.getTasks()
  }

  @Get(':id')
  async getTasksById(@Param('id') id:string): Promise<ITask> {
    return this.tasksService.getTaskById(id);
  }

  @Patch('/:id')
  updateTask(@Param('id') id: string, @Body() updateTasksDto: UpdateTasksDto): void {
    this.tasksService.updateTask(id, updateTasksDto)
  }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.tasksService.deleteTask(id);
  }
}
