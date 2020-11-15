import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CreateProjectDto } from './dto/projects.dto';
import { ProjectsService } from './projects.service';

@Controller('aip/projects')
export class ProjectsController {
  constructor(private projectService: ProjectsService) {}

  @Post()
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
