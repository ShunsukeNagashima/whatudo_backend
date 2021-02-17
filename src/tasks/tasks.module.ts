import { Module } from '@nestjs/common'
import { TasksService } from './tasks.service'
import { TasksController } from './tasks.controller'
import { Task, TaskSchema } from './schemas/tasks.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '../users/schemas/users.schema'
import { UsersService } from '../users/users.service'
import { Comment, CommentSchema } from '../comments/schemas/comments.schema'
import { ProjectsService } from '../projects/projects.service'
import { Project, ProjectSchema } from '../projects/schemas/projects.schema'
import { Counter, CounterSchema } from '../counters/schemas/counter.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Task.name, schema: TaskSchema },
      { name: User.name, schema: UserSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: Counter.name, schema: CounterSchema },
    ]),
  ],
  controllers: [TasksController],
  providers: [TasksService, UsersService, ProjectsService],
})
export class TasksModule {}
