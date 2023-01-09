import { Module } from '@nestjs/common';
import { HttpModule } from './http/http.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [HttpModule, DatabaseModule, ConfigModule.forRoot()],
})
export class AppModule {}
