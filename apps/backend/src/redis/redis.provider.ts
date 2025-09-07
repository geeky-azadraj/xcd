import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';

export const REDIS_CLIENT = 'REDIS_CLIENT';

export const RedisProvider = {
  provide: REDIS_CLIENT,
  useFactory: (configService: ConfigService) => {
    const enableRedis = configService.get<string>('ENABLE_REDIS') === 'true';
    
    if (!enableRedis) {
      // Return a mock Redis client when Redis is disabled
      return {
        info: () => Promise.resolve('Redis disabled'),
        ping: () => Promise.resolve('PONG'),
        disconnect: () => Promise.resolve(),
        on: () => {},
        off: () => {},
        options: {},
      } as any;
    }

    const redisHost = configService.get<string>('REDIS_HOST');
    const redisPort = configService.get<number>('REDIS_PORT');
    const redisPassword = configService.get<string>('REDIS_PASSWORD');
    const redisTlsEnabled = configService.get<boolean>('REDIS_TLS_ENABLED');

    return new Redis({
      host: redisHost,
      port: redisPort,
      password: redisPassword,
      tls: redisTlsEnabled ? {} : undefined,
      maxRetriesPerRequest: null,
    });
  },
  inject: [ConfigService],
};
