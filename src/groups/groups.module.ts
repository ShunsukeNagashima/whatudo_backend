import { Module } from '@nestjs/common';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { Group, GroupSchema } from './schemas/groups.schema'
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Group.name, schema: GroupSchema}])
  ],
  controllers: [GroupsController],
  providers: [GroupsService]
})
export class GroupsModule {}
