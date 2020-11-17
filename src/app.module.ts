import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';

import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { CommentsModule } from './comments/comments.module'
import { ProjectsModule } from './projects/projects.module';
import { CategoriesModule } from './categories/categories.module'

@Module({
  imports: [
    TasksModule,
    UsersModule,
    CommentsModule,
    ProjectsModule,
    CategoriesModule,
    MongooseModule.forRoot('mongodb+srv://dbUser:3QlVsufoUc2K4hAk@cluster0.hekpb.mongodb.net/whatudo?retryWrites=true&w=majority'),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
