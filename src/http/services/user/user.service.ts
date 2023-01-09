import { Injectable } from '@nestjs/common'
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { UpdateUserBodyDto } from 'src/http/controllers/user/user.dto';

@Injectable()
export class UserService {

  constructor(private prismaService: PrismaService) {}

  async getAll() {

    const users = await this.prismaService.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      }
    })

    return { users }
  }

  async getById(userId: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    user.password = undefined

    if(!user) return {user: null}

    return {user}
  }

  async update(data: UpdateUserBodyDto, userId: string) {

    const userExists = await this.prismaService.user.findUnique({
      where: {
        id: userId
      },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    if(!userExists) throw new HttpException("User does not exists", HttpStatus.BAD_REQUEST)
    if(userExists.roles.every(role => role.permissions.every(permission => permission.name.startsWith('root:')))) throw new UnauthorizedException("You don't have permission to change this user");
    

    const userUpdated = await this.prismaService.user.update({
      where: {
        id: userId
      },
      data,
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    userUpdated.password = undefined

    return { user: userUpdated }
  }
}