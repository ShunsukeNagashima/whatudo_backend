import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from  './tasks.controller';
import { Task, TaskSchema } from './schemas/tasks.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/schemas/users.schema';
import { UsersService } from '../users/users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema}
    ])
  ],
  controllers: [TasksController],
  providers: [TasksService, UsersService]
})
export class TasksModule {}
