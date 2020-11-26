import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose'

export type TaskDocument = Task & Document

@Schema()
export class Task {
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
    comments: string[];

    @Prop({ref: 'User'})
    creator: string;

    @Prop({ type: [Types.ObjectId], ref: 'User'})
    modifiedBy: string[]

    @Prop()
    pic: string;

    @Prop()
    categoryId: string;

    @Prop()
    projectId: string;

    @Prop()
    groupId: string;

    @Prop()
    createdAt: Date

    @Prop()
    updatedAt: Date
}

export const TaskSchema = SchemaFactory.createForClass(Task)