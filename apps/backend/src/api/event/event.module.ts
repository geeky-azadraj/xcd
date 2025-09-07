import { Module } from '@nestjs/common';
import { EventController } from './event.controller';
import { EventService } from './event.service';
import { EventsDBService } from '../../db/events/events-db.service';
import { EventsDBRepository } from '../../db/events/events-db.repository';
import { DBModule } from '../../db/db.module';

@Module({
  imports: [DBModule],
  controllers: [EventController],
  providers: [EventService, EventsDBService, EventsDBRepository],
  exports: [EventService, EventsDBService, EventsDBRepository],
})
export class EventModule {}
