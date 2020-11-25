import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({required: true})
  name: string;

  @Prop({required: true})
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({ type: [Types.ObjectId], ref: 'Task' })
  tasks: Types.ObjectId[]
}

export const UserSchema = SchemaFactory.createForClass(User)