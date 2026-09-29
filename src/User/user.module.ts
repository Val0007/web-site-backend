import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UserService } from './user.service';
import { userProvider } from './user.providers';
import { UsersController } from './user.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [UsersController],
  providers: [UserService, ...userProvider],
  exports: [...userProvider],
})
export class UserModule {}
