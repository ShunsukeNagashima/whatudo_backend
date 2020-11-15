import { Model } from 'mongoose';
import { Injectable, HttpStatus, HttpException } from '@nestjs/common';
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
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "プロジェクトの作成に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getProjects() {
    try {
      return this.projectModel.find().exec()
    }catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "プロジェクトの取得に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteProject(id: string) {
    let project: ProjectDocument
    try {
      project = await this.projectModel.findById(id)
    } catch(err){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "エラーが発生しました。プロジェクトを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      project.remove()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "プロジェクトの削除に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }


}
