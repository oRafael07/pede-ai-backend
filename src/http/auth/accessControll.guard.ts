import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ForbiddenException } from '@nestjs/common/exceptions'
import { Reflector } from '@nestjs/core'
import { PrismaService } from 'src/database/prisma/prisma.service'

@Injectable()
export class AccessControl implements CanActivate {

  constructor(private reflector: Reflector, private prismaService: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const [ request ] = context.getArgs()

    const user = await this.prismaService.user.findUnique({
      where: {
        id: request.user.userId
      },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    if(user.blocked) throw new ForbiddenException("You are banned :D")

    const requiredPermissions: [] = this.reflector.get('permissions', context.getHandler()) || []
        
    const hasAuthorized = requiredPermissions.every(permission => user.roles.every(role => role.permissions.every(userPermission => userPermission.name.includes(permission) || userPermission.name.startsWith("root:"))))

    if(requiredPermissions.length === 0 || hasAuthorized) return true

    throw new ForbiddenException("Insufficient Permissions")
  }
}