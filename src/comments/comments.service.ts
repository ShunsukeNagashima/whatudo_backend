import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { TaskDocument } from '../tasks/schemas/tasks.schema';
import { UserDocument } from '../users/schemas/users.schema';
import { ObjectId } from 'mongodb'
import { ClientSession } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async createComment(createCommentDto: CreateCommentDto, task: TaskDocument, user: UserDocument): Promise<void> {
    createCommentDto.creator = user.id
    const createdComment = new this.commentModel(createCommentDto);
    createdComment.createdAt = new Date();
    createdComment.updatedAt = new Date();

    createdComment.taskId = task.id
    try {
      const sess = await this.commentModel.db.startSession()
      sess.startTransaction()
      await createdComment.save({ session: sess });
      task.modifiedBy.push(user.id);
      task.comments.push(createdComment.id);
      await task.save({ session: sess });
      await sess.commitTransaction();
    } catch(err) {
      throw new HttpException({
        message: 'コメントの作成に失敗しました。再度お試しください。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  };

  async getComments() {
    try {
      return this.commentModel.find().exec
    } catch(err) {
      throw new HttpException({
        message: 'コメントの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async updateComment(id: string, updateCommentdto :UpdateCommentDto) {
    let comment: CommentDocument

    try {
      comment = await this.commentModel.findById(id).populate({path: 'creator', select: 'name'})
    } catch(err) {
      throw new HttpException({
        message: 'コメントの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if(!comment) {
      throw new HttpException({
        message: 'コメントが見つかりません。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    comment.title = updateCommentdto.title;
    comment.detail = updateCommentdto.detail;
    comment.updatedAt = new Date()

    try {
      return comment.save()
    } catch(err) {
      throw new HttpException({
        message: 'コメントの更新に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteComment(id: string, task: TaskDocument): Promise<void> {
    let comment: CommentDocument
    try {
      comment = await this.commentModel.findById(id)
    } catch(err){
      throw new HttpException({
        message: 'コメントの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      const sess = await this.commentModel.db.startSession()
      await sess.startTransaction()
      task.comments.pull(comment)
      await task.save({session: sess})
      await this.commentModel.deleteOne({_id: new ObjectId(id)}, {session: sess})
      sess.commitTransaction();
    } catch(err) {
      throw new HttpException({
        message: 'コメントが見つかりません。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCommentsByTaskId(taskId: string, sess?:ClientSession): Promise<void> {
    try {
      this.commentModel.deleteMany({taskId: new ObjectId(taskId)}, sess && {session: sess})
    } catch(err) {
      throw new HttpException({
        message: 'コメントの削除に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}
