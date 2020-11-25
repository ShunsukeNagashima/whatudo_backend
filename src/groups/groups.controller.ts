import { Controller, Get, Post, Delete, HttpCode, Param, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CreateGroupDto } from './dto/groups.dto';
import { GroupsService } from './groups.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/api/groups')
@UseGuards(JwtAuthGuard)
export class GroupsController {
  constructor(private groupService: GroupsService){}

  @Post()
  @HttpCode(201)
  async createGroup(createGroupDto: CreateGroupDto) {
    try {
      this.groupService.createGroup(createGroupDto)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'グループの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async getGroups() {
    try {
      this.groupService.getGroups()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'グループの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete(':id')
  deleteGroup(@Param('id') id: string) {
    try {
      this.groupService.deleteGroup(id)
    } catch(err) {
      if (err.message === 'could not find a group') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'グループの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if(err.message === 'delete failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'グループの削除に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
