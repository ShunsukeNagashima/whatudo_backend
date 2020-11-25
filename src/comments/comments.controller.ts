import { Controller, Post, Patch,  Body, Param, HttpCode, UseGuards, HttpException, HttpStatus, Delete, Req } from '@nestjs/common';
import { CreateCommetnDto, UpdateCommentDto } from './dto/comments.dto';
import { CommentsService } from './comments.service';
import { TasksService } from '../tasks/tasks.service';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { IUserInfo } from '../tasks/tasks.controller';
import { TaskDocument } from '../tasks/schemas/tasks.schema';
import { UserDocument } from 'src/users/schemas/users.schema';

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
  async createComment(@Body() createCommentDto: CreateCommetnDto, taskId: string, @Req() req: IUserInfo) {
    let task: TaskDocument;
    let user: UserDocument;

    try {
      task = await this.tasksService.getTaskById(taskId);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      user = await this.usersService.findUserById(req.user.userId)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'ユーザーの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      this.commentsService.createComment(createCommentDto, task, user);
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'コメントの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Patch('/:id')
  @HttpCode(201)
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto){
    this.commentsService.updateComment(id, updateCommentDto)
  }

  @Delete(':id')
  async deleteComment(@Param('id') id: string) {
    try {
      this.commentsService.deleteComment(id);
    } catch(err) {
      if (err.message === 'could not find a comment') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'コメントの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if(err.message === 'delete failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'コメントの削除に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
