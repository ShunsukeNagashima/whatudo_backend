import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
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
    this.projectService.createProject(createProjectDto)
  }

  @Get()
  async getProjects() {
    this.projectService.getProjects()
  }

  @Delete()
  async deleteProject(@Param('id') id: string) {
    this.projectService.deleteProject(id)
  }

}
