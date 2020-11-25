import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateProjectDto } from './dto/projects.dto';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post()
  @HttpCode(201)
  async createProject(@Body() createProjectDto: CreateProjectDto) {
    try {
      await this.projectService.createProject(createProjectDto)
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

  @Delete()
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
