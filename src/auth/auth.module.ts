import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ProjectsService } from '../projects/projects.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Project, ProjectSchema } from '../projects/schemas/projects.schema';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: '1h'}
    }),
    MongooseModule.forFeature(
      [
        { name: Project.name, schema: ProjectSchema },
      ]
    ),

  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ProjectsService],
  exports: [AuthService]
})
export class AuthModule {}
