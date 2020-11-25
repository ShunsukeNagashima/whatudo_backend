import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from './schemas/groups.schema'
import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/groups.dto';

@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>){}

  async createGroup(createGroupDto: CreateGroupDto) {
    const createdGroup = new this.groupModel(createGroupDto);
    try {
      return createdGroup.save()
    } catch(err) {
      return Promise.reject(new Error('create failed'))
    }
  }

  async getGroups() {
    try {
      return this.groupModel.find().exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a group'))
    }
  }

  async deleteGroup(id: string): Promise<void> {
    let group: GroupDocument
    try {
      group = await this.groupModel.findById(id)
    } catch(err){
      return Promise.reject(new Error('could not find a group'))
    }

    try {
      await group.remove()
    } catch(err) {
      return Promise.reject(new Error('delete failed'));
    }
  }
}
