import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  UseGuards,
  Delete,
  Req,
  Get,
  Query
} from '@nestjs/common';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { CommentsService } from './comments.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUserInfo } from '../tasks/tasks.controller';

@Controller('api/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(
    private commentsService: CommentsService,
    private tasksService: TasksService,
    private usersService: UsersService
  ){}

  @Post()
  @HttpCode(201)
  async createComment(@Body() createCommentDto: CreateCommentDto, @Query('taskId') taskId:string, @Req() req: IUserInfo) {
    const task = await this.tasksService.getTaskById(taskId)
    const user = await this.usersService.findUserById(req.user.userId)
    await this.commentsService.createComment(createCommentDto, task, user);
  }

  @Get()
  async getComments() {
    return this.commentsService.getComments()
  }

  @Patch('/:id')
  @HttpCode(201)
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto){
    const updatedComment = await this.commentsService.updateComment(id, updateCommentDto)
    return { commentData: updatedComment, message: 'コメントを更新しました。'}
  }

  @Delete('/:id')
  async deleteComment(@Param('id') id: string, @Query('taskId') taskId: string) {
    const task = await this.tasksService.getTaskById(taskId)
    await this.commentsService.deleteComment(id, task);
  }
}
