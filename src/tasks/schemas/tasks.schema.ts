import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { UserDocument } from '../../users/schemas/users.schema'
import { CommentDocument } from '../../comments/schemas/comments.schema'
import { ProjectDocument } from '../../projects/schemas/projects.schema'

export type TaskDocument = Task & Document

@Schema()
export class Task {
  //UI表示用ID
  @Prop({ required: true })
  taskId: number

  @Prop({ required: true })
  title: string

  @Prop()
  description: string

  @Prop()
  limitDate: Date

  @Prop()
  progress: number

  @Prop()
  status: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Comment' }] })
  comments: Types.Array<CommentDocument> & Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  creator: UserDocument & Types.ObjectId

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }] })
  modifiedBy: Types.Array<UserDocument> & Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'User' })
  personInCharge: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Category' })
  category: Types.ObjectId

  @Prop({ type: Types.ObjectId, ref: 'Project' })
  project: ProjectDocument & Types.ObjectId

  @Prop()
  createdAt: Date

  @Prop()
  updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)
