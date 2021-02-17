import { Module } from '@nestjs/common'
import { ProjectsController } from './projects.controller'
import { ProjectsService } from './projects.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Project, ProjectSchema } from './schemas/projects.schema'
import { UsersService } from '../users/users.service'
import { UserSchema, User } from '../users/schemas/users.schema'
import { JwtStrategy } from '../auth/jwt.strategy'
import { JwtModule } from '@nestjs/jwt'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Project.name, schema: ProjectSchema },
      { name: User.name, schema: UserSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_KEY_FOR_INVITING,
      signOptions: { expiresIn: '30m' },
    }),
  ],
  controllers: [ProjectsController],
  providers: [ProjectsService, UsersService, JwtStrategy],
  exports: [ProjectsService],
})
export class ProjectsModule {}
