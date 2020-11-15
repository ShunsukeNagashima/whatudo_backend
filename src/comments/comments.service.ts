import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { CreateCommetnDto, UpdateCommentDto } from './dto/comments.dto';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async createComment(createCommentDto: CreateCommetnDto) {
    const createdComment = new this.commentModel(createCommentDto);

    try {
      return createdComment.save()
    } catch(err) {
        throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "タスクを作成できませんでした。再度お試しください。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  };

  async updateComment(id: string, updateCommentdto :UpdateCommentDto) {
    let comment: CommentDocument

    try {
      comment = await this.commentModel.findById(id)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "エラーが発生しました。コメントを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if(!comment) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "指定されたidではコメントを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    comment.title = updateCommentdto.title;
    comment.detail = updateCommentdto.detail;

    try {
      comment.save()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "コメントの更新に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
