import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/projects.schema';
import { UserDocument } from '../users/schemas/users.schema';
import { CreateProjectDto } from './dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(@InjectModel(Project.name) private projectModel: Model<ProjectDocument>){}

  async createProject(createProjectDto: CreateProjectDto, user: UserDocument): Promise<ProjectDocument> {
    const createdProject = new this.projectModel(createProjectDto)

    try {
      const sess = await this.projectModel.db.startSession()
      sess.startTransaction();
      createdProject.users.push(user._id)
      user.projects.push(createdProject.id)
      await user.save({ session: sess })
      await createdProject.save({ session: sess })
      await sess.commitTransaction();
      return createdProject
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
      return this.projectModel.findById(id)
    } catch(err) {
      return Promise.reject(new Error('could not find a project'))
    }
  }

  async addUserToProject(projectId: string, user: UserDocument): Promise<ProjectDocument> {
    let project: ProjectDocument
    try {
      project = await this.projectModel.findById(projectId)

      if(!project) {
        return Promise.reject(new Error('could not find project'))
      }

      const sess = await this.projectModel.db.startSession();
      await sess.startTransaction();
      const userInPrj = project.users.find(u => u._id == user.id)
      if (userInPrj) {
        return Promise.reject(new Error('user already exists'));
      }
      project.users.push(user.id);
      await project.save({session: sess});
      user.projects.push(project)
      await user.save({session: sess});
      await sess.commitTransaction();
      return project
    } catch(err) {
      return Promise.reject(new Error('create token failed'))
    }
  }

}
