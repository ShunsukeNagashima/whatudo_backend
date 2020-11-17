import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/groups.schema'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/groups.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>){}

  async createGroup(createGroupDto: CreateGroupDto) {
    const createdGroup = new this.groupModel(createGroupDto);
    try {
      return createdGroup.save()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'グループの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getGroups() {
    try {
      return this.groupModel.find().exec()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'グループの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteGroup(id: string) {
    let group: GroupDocument
    try {
      group = await this.groupModel.findById(id)
    } catch(err){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "エラーが発生しました。グループを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      group.remove()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "グループの削除に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
