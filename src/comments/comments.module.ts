import { Module } from '@nestjs/common'
import { CommentsController } from './comments.controller'
import { CommentsService } from './comments.service'
import { Comment, CommentSchema } from './schemas/comments.schema'
import { User, UserSchema } from '../users/schemas/users.schema'
import { Task, TaskSchema } from '../tasks/schemas/tasks.schema'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersService } from '../users/users.service'
import { TasksService } from '../tasks/tasks.service'
import { Counter, CounterSchema } from '../counters/schemas/counter.schema'
import { Project, ProjectSchema } from '../projects/schemas/projects.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Comment.name, schema: CommentSchema },
      { name: User.name, schema: UserSchema },
      { name: Task.name, schema: TaskSchema },
      { name: Counter.name, schema: CounterSchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [CommentsController],
  providers: [CommentsService, UsersService, TasksService],
  exports: [CommentsService],
})
export class CommentsModule {}
