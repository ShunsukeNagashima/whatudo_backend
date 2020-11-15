import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type CommentDocument = Comment & Document

@Schema()
export class Comment {
  @Prop({ required: true })
  title: string;

  @Prop()
  detail: string;

  @Prop({ type: Types.ObjectId, ref: 'User'})
  creator: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment)