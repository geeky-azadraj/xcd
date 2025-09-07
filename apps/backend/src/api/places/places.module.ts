import { Module } from '@nestjs/common';
import { PlacesController } from './places.controller';
import { PlacesService } from './places.service';
import { RedisModule } from '@redis/redis.module';
import { GoogleMapsProvider } from './providers/google-maps.provider';

@Module({
  imports: [RedisModule],
  controllers: [PlacesController],
  providers: [
    PlacesService,
    {
      provide: 'PlacesSearchProvider',
      useClass: GoogleMapsProvider,
    },
  ],
  exports: [PlacesService, 'PlacesSearchProvider'],
})
export class PlacesModule {}
