import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/categories.dto'
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('/api/category')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private categoryService: CategoriesService){}

  @Post()
  @HttpCode(201)
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
