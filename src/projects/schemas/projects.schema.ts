import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TaskDocument } from '../../tasks/schemas/tasks.schema';

export type ProjectDocument = Project & Document

@Schema()
export class Project {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [Types.ObjectId], ref: 'Task' })
  tasks: Types.Array<TaskDocument>
}

export const ProjectSchema = SchemaFactory.createForClass(Project)