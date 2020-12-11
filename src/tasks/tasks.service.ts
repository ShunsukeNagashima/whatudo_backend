import { Model }  from 'mongoose';
import { Injectable }from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Task, TaskDocument } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { UserDocument } from '../users/schemas/users.schema';
import { ObjectId } from 'mongodb';
import { Comment, CommentDocument } from '../comments/schemas/comments.schema';
import { ProjectDocument } from '../projects/schemas/projects.schema';
import { Counter, CounterDocument } from '../counters/schemas/counter.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>
    ){}

  async createTask(createTaskDto: CreateTaskDto, user: UserDocument, project: ProjectDocument): Promise<void>{
    createTaskDto.creator = user.id
    createTaskDto.createdAt = new Date()

    const createdTask = new this.taskModel(createTaskDto);
    try {
      const sess = await this.taskModel.db.startSession();
      sess.startTransaction();
      let counterDoc: CounterDocument
      counterDoc = await this.counterModel.findOneAndUpdate(
        { key: 'taskId'},
        { $inc: { seq: 1 }},
        {
          upsert: true,
          new: true
        },
      )
      createdTask.taskId = counterDoc.seq
      await createdTask.save({ session: sess });
      user.tasks.push(createdTask.id)
      await user.save({ session: sess });
      project.tasks.push(createdTask.id)
      await project.save({ session: sess });
      await sess.commitTransaction();
    } catch(err) {
      return Promise.reject(new Error('create failed'))
    }
  }

  async getTasks(): Promise<TaskDocument[]> {
    try {
      return this.taskModel.find().exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a task'))
    }
  }

  async getTaskById(id: string): Promise<TaskDocument> {

    let task: TaskDocument;
    try {
      task =  await this.taskModel.findById(id).exec()
    } catch(err) {
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }
    return task
  }

  async updateTask(id: string, updateTaskDto:UpdateTaskDto) {
    let task: TaskDocument

    try {
      task = await this.taskModel.findById(id);
    } catch(err){
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }

    task.title = updateTaskDto.description
    task.description = updateTaskDto.description
    task.limitDate = updateTaskDto.limitDate
    task.progress = updateTaskDto.progress
    task.pic = updateTaskDto.pic
    task.categoryId = updateTaskDto.categoryId
    task.groupId = updateTaskDto.groupId
    task.updatedAt = updateTaskDto.updatedAt

    try {
      return task.save()
    } catch(err) {
      return Promise.reject(new Error('failed update'))
    }
  }

  async deleteTask(id: string): Promise<void> {
    let task: TaskDocument

    try {
     task = await this.taskModel.findById(id).populate('creator').populate('projectId');
    } catch(err){
      return Promise.reject(new Error('could not find a task'))
    }

    if (!task) {
      return Promise.reject(new Error('could not find a task'))
    }

    try {
      const sess = await this.taskModel.db.startSession()
      sess.startTransaction()
      await this.taskModel.deleteOne({_id: new ObjectId(task.id)},{session: sess})
      task.creator.tasks.pull(task)
      await task.creator.save({ session: sess });
      task.projectId.tasks.pull(task)
      await task.projectId.save({ session: sess});
      await this.commentModel.deleteMany({taskId: new ObjectId(task.id)});
      await sess.commitTransaction();
    } catch(err) {
      return Promise.reject(new Error('delete task failed'))
    }
  }
}
