import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CategoryDocument, Category } from './schemas/categories.schema';
import { CreateCategoryDto } from './dto/categories.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoriesService {
  constructor(@InjectModel(Category.name) private categoryModel: Model<CategoryDocument>){}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto)

    try {
      return createdCategory.save()
    } catch(err) {
      return Promise.reject(new Error('create failed'))
    }
  }

  async getCategories() {
    try {
      return this.categoryModel.find()
    }catch(err) {
      return Promise.reject(new Error('could not find a category'))
    }
  }

  async deleteCateory(id: string) :Promise<void>{
    let category: CategoryDocument
    try {
      category = await this.categoryModel.findById(id)
    } catch(err){
      return Promise.reject(new Error('could not find a category'))
    }

    if (!category) {
      return Promise.reject(new Error('could not find a category'))
    }

    try {
      await category.remove()
    } catch(err) {
      return Promise.reject(new Error('delete failed'))
    }
  }
}
