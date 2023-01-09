import { Controller, Get, Request, UseGuards, SetMetadata, Param, Put, Body } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport';
import { AccessControl } from 'src/http/auth/accessControll.guard';
import { UserService } from 'src/http/services/user/user.service';
import { FindByIdUserDto, UpdateUserBodyDto, UpdateUserParamDto } from './user.dto';

@Controller('user')
@UseGuards(AuthGuard('jwt'), AccessControl)
export class UserController {

  constructor(private userService: UserService) {}

  @SetMetadata('permissions', ['user:read'])
  @Get()
  async findAll() {
    const { users } = await this.userService.getAll()
    return users
  }

  @SetMetadata('permissions', ['user:read'])
  @Get(':userId')
  async findById(@Param() body: FindByIdUserDto) {

    const { userId } = body

    const { user } = await this.userService.getById(userId)

    return {user}
  }

  @SetMetadata('permissions', ['user:update'])
  @Put(':userId')
  async update(@Body() body: UpdateUserBodyDto, @Param() params: UpdateUserParamDto) {

    const { userId } = params

    const { user } = await this.userService.update(body, userId)

    return { user }
  }
}