import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
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
      throw new HttpException({
        message: 'プロジェクトの作成に失敗しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getProjects() {
    try {
      return this.projectModel.find().exec()
    }catch(err) {
      throw new HttpException({
        message: 'プロジェクトの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

 async deleteProject(id: string): Promise<void> {
    let project: ProjectDocument
    try {
      project = await this.projectModel.findById(id)
    } catch(err){
      throw new HttpException({
        message: 'プロジェクトの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      project.remove()
    } catch(err) {
      throw new HttpException({
        message: 'プロジェクトの削除に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async findProjectsById(id: string) {
    try {
      return this.projectModel.findById(id)
    } catch(err) {
      throw new HttpException({
        message: 'プロジェクトの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async addUserToProject(projectId: string, user: UserDocument): Promise<ProjectDocument> {
    let project: ProjectDocument
    try {
      project = await this.projectModel.findById(projectId)

      if(!project) {
        throw new HttpException({
          message: 'プロジェクトの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }

      const sess = await this.projectModel.db.startSession();
      await sess.startTransaction();
      const userInPrj = project.users.find(u => u._id == user.id)
      if (userInPrj) {
        throw new HttpException({
          message: '既に参加済みのプロジェクトです。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
      project.users.push(user.id);
      await project.save({session: sess});
      user.projects.push(project)
      await user.save({session: sess});
      await sess.commitTransaction();
      return project
    } catch(err) {
      throw new HttpException({
        message: 'プロジェクトへの参加に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
