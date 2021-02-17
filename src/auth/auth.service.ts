import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { compare } from 'bcryptjs'
import { User, UserDocument } from '../users/schemas/users.schema'
import { UsersService } from '../users/users.service'
import { ProjectsService } from '../projects/projects.service'
import { JwtService } from '@nestjs/jwt'
import { ProjectDocument } from 'src/projects/schemas/projects.schema'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private projectsService: ProjectsService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    let existingUser: User
    try {
      existingUser = await this.usersService.findUserByEmail(email)
    } catch (err) {
      throw new HttpException(
        {
          error: 'エラーが発生しました。もう一度お試しください。',
        },
        HttpStatus.INTERNAL_SERVER_ERROR
      )
    }

    if (!existingUser) {
      throw new HttpException(
        {
          message: 'Eメールまたはパスワードが間違っています。',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    let isValidPassword: boolean
    try {
      isValidPassword = await compare(password, existingUser.password)
    } catch (err) {
      throw new HttpException(
        {
          message: 'エラーが発生しました。もう一度お試しください。',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    if (!isValidPassword) {
      throw new HttpException(
        {
          message: 'Eメールまたはパスワードが間違っています。',
        },
        HttpStatus.UNAUTHORIZED
      )
    }

    return existingUser
  }

  async login(user: UserDocument, token?: string) {
    let project: ProjectDocument
    if (token) {
      try {
        const result = this.jwtService.verify(token, {
          secret: process.env.JWT_KEY_FOR_INVITING,
        })
        if (result) {
          const d = new Date(0)
          d.setUTCSeconds(result.exp)
          if (d > new Date()) {
            project = await this.projectsService.addUserToProject(
              result.projectId,
              user
            )
          } else {
            throw new HttpException(
              {
                message: 'トークンの有効期限が切れています。',
              },
              HttpStatus.BAD_REQUEST
            )
          }
        }
      } catch (err) {
        throw new HttpException(
          {
            message: 'プロジェクトへの参加に失敗しました。再度お試しください。',
          },
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }
    }
    const payload = { email: user.email, sub: user.id }
    return {
      userId: user.id,
      projects: user.projects,
      access_token: this.jwtService.sign(payload, {
        secret: process.env.JWT_KEY,
      }),
      project,
    }
  }
}
