import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose'
import { CategoryDocument, Category } from './schemas/categories.schema'
import { CreateCategoryDto } from './dto/categories.dto'
import { Injectable, HttpStatus, HttpException } from '@nestjs/common'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name) private categoryModel: Model<CategoryDocument>
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    const createdCategory = new this.categoryModel(createCategoryDto)

    try {
      return createdCategory.save()
    } catch (err) {
      throw new HttpException(
        {
          message: 'カテゴリの作成に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async getCategories() {
    try {
      return this.categoryModel.find()
    } catch (err) {
      throw new HttpException(
        {
          message: 'カテゴリの取得に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  async deleteCateory(id: string): Promise<void> {
    let category: CategoryDocument
    try {
      category = await this.categoryModel.findById(id)
    } catch (err) {
      throw new HttpException(
        {
          message: 'カテゴリの取得に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    if (!category) {
      throw new HttpException(
        {
          message: 'カテゴリが見つかりません。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    try {
      await category.remove()
    } catch (err) {
      throw new HttpException(
        {
          message: 'カテゴリの削除に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }
}
