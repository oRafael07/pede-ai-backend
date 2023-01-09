import { Controller, Post, Get, Body } from '@nestjs/common'
import { LoginSessionDtoBody, RegisterSessionDtoBody } from './session.dto';
import { SessionService } from '../../services/session/session.service';

@Controller('auth')
export class SessionController {

  constructor(private sessionService: SessionService) {}

  @Post('login')
  async login(@Body() body: LoginSessionDtoBody) {

    const { email, password } = body

    return await this.sessionService.login({ email, password })
  }

  @Post('register')
  async register(@Body() body: RegisterSessionDtoBody) {
    const { name, email, password } = body

    return await this.sessionService.register({ name, email, password })
  }
}