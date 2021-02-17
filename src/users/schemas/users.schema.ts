import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Types, Document } from 'mongoose'
import { TaskDocument } from '../../tasks/schemas/tasks.schema'
import { ProjectDocument } from '../../projects/schemas/projects.schema'

export type UserDocument = User & Document

@Schema()
export class User {
  @Prop({ required: true })
  name: string

  @Prop({ required: true })
  email: string

  @Prop({ required: true })
  password: string

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Project' }] })
  projects: Types.Array<ProjectDocument> | Types.Array<Types.ObjectId>

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task' }] })
  tasks: Types.Array<TaskDocument> & Types.Array<Types.ObjectId>
}

export const UserSchema = SchemaFactory.createForClass(User)
