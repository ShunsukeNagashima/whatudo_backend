import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards, HttpException, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/api/categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoryService: CategoriesService){}

  @Post()
  @HttpCode(201)
  async createCategory(@Body() createCategoryDto: CreateCategoryDto){
    try {
      await this.categoryService.createCategory(createCategoryDto)
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'カテゴリの作成に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get()
  async getCategories() {
    try {
      return this.categoryService.getCategories()
    } catch(err) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'カテゴリの取得に失敗しました。'
      }, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    try {
      await this.categoryService.deleteCateory(id)
    } catch(err) {
      if (err.message === 'could not find a category') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'カテゴリの取得に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      } else if(err.message === 'delete failed') {
        throw new HttpException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'カテゴリの削除に失敗しました。'
        }, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  }
}
