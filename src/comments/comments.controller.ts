import { Controller, Post, Patch,  Body, Param } from '@nestjs/common';
import { CreateCommetnDto, UpdateCommentDto } from './dto/comments.dto';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
  constructor(private commensService: CommentsService){}

  @Post()
  async createComment(@Body() createCommentDto: CreateCommetnDto) {
    this.commensService.createComment(createCommentDto);
  }

  @Patch('/:id')
  async updateComment(@Param('id') id: string, @Body() updateCommentDto: UpdateCommentDto){
    this.commensService.updateComment(id, updateCommentDto)
  }
}
