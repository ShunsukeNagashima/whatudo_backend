import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  HttpCode,
  UseGuards,
  HttpException,
  HttpStatus,
  Req,
  Query,
} from '@nestjs/common'
import { CreateProjectDto } from './dto/projects.dto'
import { ProjectsService } from './projects.service'
import { UsersService } from '../users/users.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { JwtService } from '@nestjs/jwt'

interface IUserInfo extends Request {
  user: {
    email: string
    userId: string
  }
}

@Controller('api/projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private projectService: ProjectsService,
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  @Post()
  @HttpCode(201)
  async createProject(
    @Req() req: IUserInfo,
    @Body() createProjectDto: CreateProjectDto
  ) {
    const user = await this.usersService.findUserById(req.user.userId)
    const project = await this.projectService.createProject(
      createProjectDto,
      user
    )
    return { project, message: 'プロジェクトを作成しました。' }
  }

  @Get()
  async getProjects() {
    return this.projectService.getProjects()
  }

  @Get('/invite/:projectId')
  async createTokenForInviting(
    @Param('projectId') projectId: string,
    @Req() req: IUserInfo
  ) {
    try {
      const payLoad = {
        projectId,
        userId: req.user.userId,
      }
      const options = {
        secret: process.env.JWT_KEY_FOR_INVITING,
        expiresIn: '30m',
      }

      const token = this.jwtService.sign(payLoad, options)
      return { invitationToken: token }
    } catch (err) {
      throw new HttpException(
        {
          message: 'トークンの作成に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
  }

  @Get('/addUser/:projectId')
  async addUserTOProject(
    @Query('token') token: string,
    @Param('projectId') projectId: string,
    @Req() req: IUserInfo
  ) {
    let result
    try {
      result = this.jwtService.verify(token, {
        secret: process.env.JWT_KEY_FOR_INVITING,
      })
    } catch (err) {
      throw new HttpException(
        {
          message: 'プロジェクトの認証に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    if (result) {
      const user = await this.usersService.findUserById(req.user.userId)
      await this.projectService.addUserToProject(projectId, user)
    } else {
      throw new HttpException(
        {
          message: 'プロジェクトの参加に失敗しました。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }
    return { message: 'プロジェクトに参加しました。' }
  }

  @Delete('/:projectId')
  async deleteProject(@Param('id') id: string) {
    await this.projectService.deleteProject(id)
  }
}
