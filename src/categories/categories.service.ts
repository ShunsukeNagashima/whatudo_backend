import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument, Category } from './schemas/categories.schema';
import { CreateCategoryDto } from './dto/categories.dto';
import { HttpStatus, HttpException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>){}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto)

    try {
      return createdCategory.save()
    } catch(err) {
        throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "カテゴリを作成できませんでした。再度お試しください。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async getCategory() {
    try {
      return this.categoryModel.find().exec()
    }catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "カテゴリの取得に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  async deleteCateory(id: string) {
    let category: CategoryDocument
    try {
      category = await this.categoryModel.findById(id)
    } catch(err){
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "エラーが発生しました。カテゴリを見つけられませんでした。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

    try {
      category.remove()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: "カテゴリの削除に失敗しました。"
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }

  }
}
