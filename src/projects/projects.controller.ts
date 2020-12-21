import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards, HttpException, HttpStatus, Req } from '@nestjs/common';
import { CreateProjectDto } from './dto/projects.dto';
import { ProjectsService } from './projects.service';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/schemas/users.schema';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

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
    private usersService: UsersService
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
      await this.projectService.createProject(createProjectDto, user)
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
