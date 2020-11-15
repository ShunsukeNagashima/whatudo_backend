import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from  './tasks.controller';
import { Task, TaskShcema } from './schemas/tasks.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Task.name, schema: TaskShcema }])
  ],
  controllers: [TasksController],
  providers: [TasksService]
})
export class TasksModule {}
