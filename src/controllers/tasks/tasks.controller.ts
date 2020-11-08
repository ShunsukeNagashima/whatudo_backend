import { Controller, Get, Post, Patch, Delete } from '@nestjs/common';

@Controller('tasks')
export class TasksController {
  @Post()
  createTask(): string {
    return 'This action create new task'
  }

  @Get()
  getTasks(): string {
    return 'This action returns all tasks';
  }

  @Patch('/:id')
  updateTask(): string {
    return 'This action update a task'
  }

  @Delete('/:id')
  deleteTask(): string {
    return 'This action delete a task'
  }
}
