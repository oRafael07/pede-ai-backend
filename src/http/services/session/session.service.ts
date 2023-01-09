import { Injectable } from '@nestjs/common'
import { HttpException, UnauthorizedException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { compareSync, hashSync } from 'bcrypt'
import { JwtService } from 'src/jwt/jwt.service';
import { HttpStatus } from '@nestjs/common/enums';

export interface ILoginSessionRequest {
  email: string
  password: string;
}

export interface IRegisterSessionRequest {
  name: string
  email: string
  password: string
}

@Injectable()
export class SessionService {

  constructor(private prismaService: PrismaService, private jwtService: JwtService) {}

  async login(request: ILoginSessionRequest) {
    const { email, password } = request

    const user = await this.prismaService.user.findUnique({
      where: {
        email
      },
      include: {
        roles: {
          include: {
            permissions: true
          }
        }
      }
    })

    if(!user) throw new UnauthorizedException("Invalid Credencials")
    if(!compareSync(password, user.password)) throw new UnauthorizedException("Invalid Credencials")

    user.password = undefined

    const token = this.jwtService.sign(user, '14d')

    return { user, token }
  }

  async register(request: IRegisterSessionRequest) {
    const { name, email, password } = request

    const userExists = await this.prismaService.user.findFirst({
      where: {
        email
      },
      select: {
        email: true
      }
    })

    if(userExists) throw new HttpException("User already exists", HttpStatus.BAD_REQUEST)

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password: hashSync(password, 10)
      }
    })

    user.password = undefined

    const token = this.jwtService.sign(user, '14d')

    return { user, token }
  }
}