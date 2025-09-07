import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OtelService } from './otel.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [OtelService],
})
export class OtelModule {}
