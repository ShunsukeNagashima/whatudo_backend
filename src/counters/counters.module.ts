import { Module } from '@nestjs/common'
import { Counter, CounterSchema } from './schemas/counter.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Counter.name, schema: CounterSchema}
    ])
  ],
})

export class CounterModule{}