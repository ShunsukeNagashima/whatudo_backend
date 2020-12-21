import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from './schemas/projects.schema';
import { UsersService } from '../users/users.service';
import { UserSchema, User } from '../users/schemas/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature(
      [
        { name: Project.name, schema: ProjectSchema },
        { name: User.name, schema: UserSchema }
      ]
    )
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService],
  exports: [ProjectsService]
})
export class ProjectsModule {}
