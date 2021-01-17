import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { UserDocument } from '../../users/schemas/users.schema';

export type CommentDocument = Comment & Document

@Schema()
export class Comment {
  @Prop()
  title: string;

  @Prop()
  detail: string;

  @Prop({ type: Types.ObjectId, ref: 'User'})
  creator: UserDocument;

  @Prop({ type: Types.ObjectId, ref: 'Task'})
  taskId: Types.ObjectId
}

export const CommentSchema = SchemaFactory.createForClass(Comment)