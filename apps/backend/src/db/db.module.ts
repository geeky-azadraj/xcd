import { DBService } from '@db/db.service';
import { CustomerDbRepository } from './customer/customer-db.repository';
import { CustomerDbService } from './customer/customer-db.service';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [DBService, CustomerDbRepository, CustomerDbService],
  exports: [DBService, CustomerDbRepository, CustomerDbService],
})
export class DBModule {}
