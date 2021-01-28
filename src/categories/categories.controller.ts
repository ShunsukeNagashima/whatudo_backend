import { Controller, Get, Post, Delete, Body, Param, HttpCode, UseGuards } from '@nestjs/common';
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
    await this.categoryService.createCategory(createCategoryDto)
  }

  @Get()
  async getCategories() {
    return this.categoryService.getCategories()
  }

  @Delete('/:id')
  async deleteCategory(@Param('id') id: string) {
    await this.categoryService.deleteCateory(id)
  }
}
