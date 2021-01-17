import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskDocument } from '../../tasks/schemas/tasks.schema';
import { UserDocument } from '../../users/schemas/users.schema';

export type ProjectDocument = Project & Document

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Task'}] })
  tasks: Types.Array<TaskDocument> & Types.Array<Types.ObjectId>

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User'}] })
  users: Types.Array<UserDocument> & Types.Array<Types.ObjectId>
}

export const ProjectSchema = SchemaFactory.createForClass(Project)