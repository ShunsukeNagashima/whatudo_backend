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


@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService){}

  @Post()
  @HttpCode(201)
  async createTask(@Body createTaskDto: CreateTaskDto) {
    this.taskService.createTask(createTaskDto);
  }

  @Get()
  async getTasks(): Promise<ITask[]> {
    return this.taskService.getTasks()
  }

  @Get(':id')
  getTasksById(@Param('id') id: string): ITask {
    return this.taskService.getTaskById(id);
  }

  // @Patch('/:id')
  // updateTask(@Param('id') id: string, @Body() updateTasksDto: UpdateTasksDto): void {
  //   this.taskService.updateTask(id, updateTasksDto)
  // }

  @Delete('/:id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }
}
