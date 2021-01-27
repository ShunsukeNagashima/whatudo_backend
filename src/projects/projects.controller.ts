import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Query
 } from '@nestjs/common';
import { CreateProjectDto } from './dto/projects.dto';
import { ProjectsService } from './projects.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

interface IUserInfo extends Request{
  user: {
    email: string,
    userId: string
  }
}

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  async createProject(@Req() req: IUserInfo, @Body() createProjectDto: CreateProjectDto) {

    let user: UserDocument
    try {
      user = await this.usersService.findUserById(req.user.userId)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'エラーが発生しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      const project = await this.projectService.createProject(createProjectDto, user)
      return { project, message: 'プロジェクトを作成しました。'}
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'プロジェクトの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async getProjects() {
    try {
     await this.projectService.getProjects()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'プロジェクトの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/invite/:projectId')
  async createTokenForInviting(@Param('projectId') projectId: string, @Req() req: IUserInfo) {
    try {
      const payLoad = {
        projectId,
        userId: req.user.userId
      }
      const options = {
        secret: process.env.JWT_KEY_FOR_INVITING,
        expiresIn: '30m'
      }

      const token = this.jwtService.sign(payLoad, options)
      return { invitationToken: token }
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'トークンの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('/addUser/:projectId')
  async addUserTOProject(@Query('token') token: string,
                         @Param('projectId') projectId: string,
                         @Req() req: IUserInfo ) {
    try {
      const result = this.jwtService.verify(token, { secret: process.env.JWT_KEY_FOR_INVITING })
      if(result) {
        const user = await this.usersService.findUserById(req.user.userId)
        await this.projectService.addUserToProject(projectId, user);
      } else {
        console.log('失敗')
        throw new Error
      }
      return { message: 'プロジェクトに参加しました。'}
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'トークンの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete('/:projectId')
  async deleteProject(@Param('id') id: string) {
    try {
      await this.projectService.deleteProject(id)
    } catch(err) {
      if (err.message === 'could not find a project') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'プロジェクトの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if(err.message === 'delete failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'プロジェクトの削除に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }

}
