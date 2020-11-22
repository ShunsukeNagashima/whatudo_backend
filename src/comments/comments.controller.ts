import { Controller, Post, Patch,  Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { CreateCommetnDto, UpdateCommentDto } from './dto/comments.dto';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('api/comments')
@UseGuards(JwtAuthGuard)
export class CommentsController {
  constructor(private commensService: CommentsService){}

  @Post()
  @HttpCode(201)
  async createComment(@Body() createCommentDto: CreateCommetnDto) {
    this.commensService.createComment(createCommentDto);
  }

  @Patch('/:id')
  @HttpCode(201)
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto){
    this.commensService.updateComment(id, updateCommentDto)
  }
}
