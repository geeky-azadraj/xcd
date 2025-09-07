import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { UserDBService } from '../../db/user/user-db.service';
import { UserDBRepository } from '../../db/user/user-db.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserDBService, UserDBRepository],
  exports: [UserService, UserDBService],
})
export class UserModule {}
