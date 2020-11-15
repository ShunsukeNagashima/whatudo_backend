import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories.dto'

@Controller('/api/category')
export class CategoriesController {
  constructor(private categoryService: CategoriesService){}

  @Post()
  async createCategory(@Body() createCategoryDto: CreateCategoryDto){
    this.categoryService.createCategory(createCategoryDto)
  }

  @Get()
  async getCategories() {
    this.categoryService.getCategory()
  }

  @Delete()
  async deleteCategory(@Param('id') id: string) {
    this.categoryService.deleteCateory(id)
  }
}
