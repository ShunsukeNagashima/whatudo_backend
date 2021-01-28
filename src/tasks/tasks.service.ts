import { Model }  from 'mongoose';
import {
  Injectable,
  HttpStatus,
  HttpException
}from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Task, TaskDocument } from './schemas/tasks.schema';
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto';
import { UserDocument } from '../users/schemas/users.schema';
import { ObjectId } from 'mongodb';
import { Comment, CommentDocument } from '../comments/schemas/comments.schema';
import { Project, ProjectDocument } from '../projects/schemas/projects.schema';
import { Counter, CounterDocument } from '../counters/schemas/counter.schema';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<TaskDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    @InjectModel(Counter.name) private counterModel: Model<CounterDocument>,
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>
    ){}

  async createTask(createTaskDto: CreateTaskDto, user: UserDocument, project: ProjectDocument): Promise<void>{
    createTaskDto.creator = user.id

    const createdTask = new this.taskModel(createTaskDto);
    createdTask.createdAt = new Date()
    createdTask.updatedAt = new Date()
    try {
      const sess = await this.taskModel.db.startSession();
      sess.startTransaction();
      let counterDoc: CounterDocument
      counterDoc = await this.counterModel.findOneAndUpdate(
        { key1: 'taskId', key2: createTaskDto.project },
        { $inc: { seq: 1 }},
        {
          upsert: true,
          new: true,
          session: sess
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
      throw new HttpException({
        message: 'タスクの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTaskById(id: string): Promise<TaskDocument> {
    let task: TaskDocument;
    try {
      task = await this.taskModel.findById(id).populate({path: 'comments', populate: { path: 'creator', select: 'name' }});
    } catch(err) {
      throw new HttpException({
        messag: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!task) {
      throw new HttpException({
        messag: 'タスクが見つかりませんでした。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return task
  }

  async getTaskByTaskId(taskId: number, projectId: string): Promise<TaskDocument> {
    let task: TaskDocument;
    try {
      task = await this.taskModel.findOne({taskId, project: projectId}).populate({path: 'comments', populate: { path: 'creator', select: 'name' }});
    } catch(err) {
      throw new HttpException({
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!task) {
      throw new HttpException({
        message: 'タスクが見つかりませんでした。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
    return task
  }

  async updateTask(taskId: number, projectId: string, userDoc: UserDocument, updateTaskDto:UpdateTaskDto) {
    let task: TaskDocument
    try {
      task = await this.taskModel.findOne({taskId, project: projectId}).populate({path: 'comments', populate: { path: 'creator', select: 'name' }});
    } catch(err){
      throw new HttpException({
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!task) {
      throw new HttpException({
        message: 'タスクが見つかりませんでした。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    task.title = updateTaskDto.title
    task.description = updateTaskDto.description
    task.limitDate = updateTaskDto.limitDate
    task.progress = updateTaskDto.progress
    task.personInCharge = new ObjectId(updateTaskDto.personInCharge)
    task.category = new ObjectId(updateTaskDto.category)
    task.updatedAt = new Date();
    task.modifiedBy.push(userDoc._id)

    const createdComment = new this.commentModel(updateTaskDto.comment);

    try {
      createdComment.creator　= userDoc._id
      createdComment.taskId = task._id;

      const sess = await this.taskModel.db.startSession();
      sess.startTransaction();
      if (createdComment.title) {
        await createdComment.save({session: sess});
        task.comments.push(createdComment);
      }
      await task.save({session: sess});
      await sess.commitTransaction();
      if (createdComment.title) {
        task.comments.slice(-1)[0].creator = userDoc
      }
      return task;
    } catch(err) {
      throw new HttpException({
        message: 'タスクの更新に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteTask(id: string): Promise<void> {
    let task: TaskDocument

    try {
     task = await this.taskModel.findById(id).populate('creator').populate('project');
    } catch(err){
      throw new HttpException({
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    if (!task) {
      throw new HttpException({
        message: 'タスクが見つかりませんでした。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      const sess = await this.taskModel.db.startSession()
      sess.startTransaction()
      await this.taskModel.deleteOne({_id: new ObjectId(task.id)},{session: sess})
      task.creator.tasks.pull(task)
      await task.creator.save({ session: sess });
      task.project.tasks.pull(task)
      await task.project.save({ session: sess});
      await this.commentModel.deleteMany({taskId: new ObjectId(task.id)});
      await sess.commitTransaction();
    } catch(err) {
      throw new HttpException({
        message: 'タスクの削除に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTasksByProjectId(pid: string) {
    try {
      const project = await this.projectModel.findById(pid);
      const tasks = await this.taskModel.find({
        '_id': { $in: project.tasks }
      }).populate('category').populate('personInCharge')
      return {tasks, message: 'タスクの取得に成功しました。'}
    } catch(err) {
      throw new HttpException({
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getTasksByUserId(userId: string) {
    try {
      const tasks = await this.taskModel.find({ personInCharge: new ObjectId(userId)}).populate('comments');
      return tasks;
    } catch(err) {
      throw new HttpException({
        message: 'タスクの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

}
