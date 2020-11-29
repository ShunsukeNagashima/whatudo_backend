import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';
import { TaskDocument } from '../../tasks/schemas/tasks.schema'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }]})
  tasks: Types.Array<TaskDocument>
}

export const UserSchema = SchemaFactory.createForClass(User)