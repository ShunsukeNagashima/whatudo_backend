import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument } from './schemas/comments.schema';
import { CreateCommentDto, UpdateCommentDto } from './dto/comments.dto';
import { Injectable } from '@nestjs/common';
import { TaskDocument } from '../tasks/schemas/tasks.schema';
import { UserDocument } from '../users/schemas/users.schema';
import { ObjectId } from 'mongodb'
import { ClientSession } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>){}

  async createComment(createCommentDto: CreateCommentDto, task: TaskDocument, user: UserDocument): Promise<void> {
    const createdComment = new this.commentModel(createCommentDto);

    createdComment.taskId = task.id
    createdComment.creator = user.id
    try {
      const sess = await this.commentModel.db.startSession()
      sess.startTransaction()
      await createdComment.save({ session: sess });
      task.modifiedBy.push(user.id);
      task.comments.push(createdComment.id);
      await task.save({ session: sess });
      await sess.commitTransaction();
    } catch(err) {
      return Promise.reject(new Error('create comment failed'))
    }
  };

  async getComments() {
    try {
      return this.commentModel.find().exec
    } catch(err) {
      return Promise.reject(new Error('get comments failed'))
    }
  }

  async updateComment(id: string, updateCommentdto :UpdateCommentDto): Promise<void> {
    let comment: CommentDocument

    try {
      comment = await this.commentModel.findById(id)
    } catch(err) {
      return Promise.reject(new Error('could not find a comment'))
    }

    if(!comment) {
      return Promise.reject(new Error('could not find a comment'))
    }

    comment.title = updateCommentdto.title;
    comment.detail = updateCommentdto.detail;

    try {
      await comment.save()
    } catch(err) {
      return Promise.reject(new Error('update comment failed'))
    }
  }

  async deleteComment(id: string): Promise<void> {
    let comment: CommentDocument
    try {
      comment = await this.commentModel.findById(id)
    } catch(err){
      return Promise.reject(new Error('could not find a comment'));
    }

    try {
      comment.remove()
    } catch(err) {
      return Promise.reject(new Error('delete comment failed'));
    }
  }

  async deleteCommentsByTaskId(taskId: string, sess?:ClientSession): Promise<void> {
    try {
      this.commentModel.deleteMany({taskId: new ObjectId(taskId)}, sess && {session: sess})
    } catch(err) {
      return Promise.reject(new Error('delete comments failed'));
    }
  }
}
