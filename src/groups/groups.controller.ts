import { Controller, Get, Post, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
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
    this.groupService.createGroup(createGroupDto)
  }

  @Get()
  async getGroups() {
    this.groupService.getGroups()
  }

  @Delete(':id')
  deleteGroup(@Param('id') id: string) {
    this.groupService.deleteGroup(id)
  }

}
