import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose'
import { UserDocument } from '../../users/schemas/users.schema';
import { CommentDocument } from '../../comments/schemas/comments.schema'
import { ProjectDocument } from '../../projects/schemas/projects.schema';

export type TaskDocument = Task & Document

@Schema()
export class Task {
    //UI表示用ID
    @Prop({ required: true})
    taskId: number;

    @Prop({ required: true })
    title: string;

    @Prop()
    description: string;

    @Prop()
    limitDate: Date;

    @Prop()
    progress: number;

    @Prop()
    status: string;

    @Prop({ type: [Types.ObjectId]})
    comments: Types.Array<CommentDocument>;

    @Prop({ type: Types.ObjectId, ref: 'User'})
    creator: UserDocument;

    @Prop({ type: [Types.ObjectId], ref: 'User'})
    modifiedBy: Types.Array<UserDocument>

    @Prop({ type: Types.ObjectId, ref: 'User'})
    pic: string;

    @Prop({ type: Types.ObjectId, ref: 'Category' })
    categoryId: string;

    @Prop({ type: Types.ObjectId, ref: 'Project'})
    projectId: ProjectDocument

    @Prop({ type: Types.ObjectId, ref: 'Group'})
    groupId: string;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)