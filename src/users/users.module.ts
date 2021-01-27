import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { AuthService } from '../auth/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Project, ProjectSchema } from '../projects/schemas/projects.schema';
import { ProjectsService } from '../projects/projects.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema},
      { name: Project.name, schema: ProjectSchema }
    ]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h' }
    })
  ],
  controllers: [UsersController],
  providers: [UsersService, AuthService, ProjectsService],
  exports: [UsersService]
})
export class UsersModule {}
