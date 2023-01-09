import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { SessionController } from './controllers/session/session.controller';
import { SessionService } from './services/session/session.service';
import { JwtService } from 'src/jwt/jwt.service';
import { JwtModule } from 'src/jwt/jwt.module';
import { UserController } from './controllers/user/user.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserService } from './services/user/user.service';

@Module({
  imports: [DatabaseModule, JwtModule],
  controllers: [SessionController, UserController],
  providers: [SessionService, JwtService, JwtStrategy, UserService]
})
export class HttpModule {}
