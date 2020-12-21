import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CounterDocument = Counter & Document;

@Schema()
export class Counter {

  @Prop()
  key1: string;

  @Prop()
  key2: string;

  @Prop()
  seq: number;
}

export const CounterSchema = SchemaFactory.createForClass(Counter)