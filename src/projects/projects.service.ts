import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/projects.schema';
import { CreateProjectDto } from './dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>){}

  async createProject(createProjectDto: CreateProjectDto) {
    const createdProject = new this.projectModel(createProjectDto)

    try {
      return createdProject.save()
    } catch(err) {
      return Promise.reject(new Error('create project failed'))
    }
  }

  async getProjects() {
    try {
      return this.projectModel.find().exec()
    }catch(err) {
      return Promise.reject(new Error('could not gett projects'))
    }
  }

 async deleteProject(id: string): Promise<void> {
    let project: ProjectDocument
    try {
      project = await this.projectModel.findById(id)
    } catch(err){
      return Promise.reject(new Error('could not find a project'));
    }

    try {
      project.remove()
    } catch(err) {
      return Promise.reject(new Error('delete project failed'));
    }
  }

  async findProjectsById(id: string) {
    try {
      return this.projectModel.findById(id).exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a project'))
    }
  }

}
