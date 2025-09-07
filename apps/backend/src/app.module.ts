import { BackgroundModule } from '@bg/background.module';
import { DEFAULT_JOB_OPTIONS, QueuePrefix } from '@bg/constants/job.constant';
import { EnvConfigModule } from '@config/env-config.module';
import { DBModule } from '@db/db.module';
import { HealthModule } from '@health/health.module';
import { HttpLoggingInterceptor } from '@interceptors/logging.interceptor';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { LoggerModule } from '@logger/logger.module';
import { MetricsModule } from '@metrics/metrics.module';
import { MetricsMiddleware } from '@middlewares/metrics.middleware';
import { BullModule } from '@nestjs/bullmq';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { Logger, MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DevtoolsModule } from '@nestjs/devtools-integration';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RedisModule } from '@redis/redis.module';
import { REDIS_CLIENT } from '@redis/redis.provider';
import { Redis } from 'ioredis';
import { ConfigService } from '@nestjs/config';
import { EnvConfig } from '@config/env.config';
import { ErrorHandlerService } from '@common/services/error-handler.service';
import { DevToolsModule } from './api/dev-tools/dev-tools.module';
import { CustomerModule } from './api/customer/customer.module';
import { PlacesModule } from './api/places/places.module';
import { EventModule } from './api/event/event.module';
import { AuthModule } from './api/auth/auth.module';
import { UserModule } from './api/user/user.module';
import { OtelModule } from '@otel/otel.module';
import { DevToolsMiddleware } from '@middlewares/dev-tool.middleware';
import { RouteNames } from '@common/route-names';
import { CookieAuthMiddleware } from '@middlewares/cookies.middleware';
import { AccessTokenVerificationMiddleware } from '@middlewares/access-token-verification.middleware';
import { CookieService } from '@common/services/cookie.service';
import { UserDBService } from '@db/user/user-db.service';
import { UserDBRepository } from '@db/user/user-db.repository';
import { RefreshTokenVerificationMiddleware } from '@middlewares/refresh-token-verification.middlewate';

const configService = new ConfigService<EnvConfig>();
const enableRedis = (configService.get('ENABLE_REDIS' as any) as string) === 'true';

// Queue module - only create if Redis is enabled
const queueModule = enableRedis ? BullModule.forRootAsync({
  imports: [RedisModule],
  useFactory: (redisClient: Redis) => {
    Logger.log(`Connecting to Redis using predefined client`);
    return {
      prefix: QueuePrefix.SYSTEM, // For grouping queues
      connection: redisClient.options,
      defaultJobOptions: DEFAULT_JOB_OPTIONS,
    };
  },
  inject: [REDIS_CLIENT],
}) : null;

// Rate Limiting
const rateLimit = ThrottlerModule.forRoot([
  {
    name: 'short',
    ttl: 1 * 60, // Time to live in seconds (1 minute)
    limit: 30, // Maximum number of requests within the ttl
  },
  {
    name: 'medium',
    ttl: 5 * 60, // 5 minutes
    limit: 100,
  },
  {
    name: 'long',
    ttl: 30 * 60, // 30 minutes
    limit: 500,
  },
  {
    name: 'very-long',
    ttl: 60 * 60, // 1 hour
    limit: 1000,
  },
]);

// Cache Module - only create if Redis is enabled
const cacheModule = enableRedis ? CacheModule.registerAsync({
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: configService.get<string>('REDIS_HOST'),
        port: configService.get<number>('REDIS_PORT'),
      },
    });

    return {
      store: store,
      ttl: 5 * 60000, // Default - 5 minutes (milliseconds)
    };
  },
  isGlobal: true,
}) : CacheModule.register({
  isGlobal: true,
  ttl: 5 * 60000, // Default - 5 minutes (milliseconds)
});

@Module({
  imports: [
    DevtoolsModule.register({
      http: process.env.NODE_ENV !== 'production',
    }),
    rateLimit,
    cacheModule,
    EnvConfigModule,
    LoggerModule,
    EventEmitterModule.forRoot(),
    ...(enableRedis ? [RedisModule] : []),
    DBModule,

    // Background Workers - only load if Redis is enabled
    ...(enableRedis && queueModule ? [queueModule] : []),
    // ...(enableRedis ? [BackgroundModule] : []), // Temporarily disabled

    // OpenTelemetry
    OtelModule,

    // APIs
    MetricsModule,
    HealthModule,
    AuthModule,
    DevToolsModule,
    CustomerModule,
    PlacesModule,
    EventModule,
    UserModule
  ],
  providers: [
    ErrorHandlerService,
    CookieService,
    UserDBService,
    UserDBRepository,
    DevToolsMiddleware,
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpLoggingInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Apply to all routes
    consumer.apply(MetricsMiddleware).forRoutes('*');
    consumer.apply(CookieAuthMiddleware).forRoutes('*');
    // consumer.apply(AccessTokenVerificationMiddleware)
    // .exclude({ path: ':version/auth/(.*)', method: RequestMethod.ALL })
    // .forRoutes('*');
    // consumer
    // .apply(RefreshTokenVerificationMiddleware)
    // .forRoutes({ path: ':version/auth/refresh', method: RequestMethod.POST });
    consumer
      .apply(DevToolsMiddleware)
      .forRoutes(
        `:version/${RouteNames.DEV_TOOLS}`,
        `:version/${RouteNames.HEALTH}/${RouteNames.HEALTH_UI}`,
        `${RouteNames.QUEUES_UI}`,
        `${RouteNames.API_DOCS}`
      );
  }
}
