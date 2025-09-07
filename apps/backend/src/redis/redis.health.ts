import { Injectable } from '@nestjs/common';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';
import { Redis } from 'ioredis';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisClient: Redis) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    try {
      // Check if Redis is disabled (mock client)
      if (this.redisClient.info && typeof this.redisClient.info === 'function') {
        const info = await this.redisClient.info();
        if (info === 'Redis disabled') {
          return this.getStatus(key, true, { message: 'Redis disabled' });
        }
      }

      // Ping Redis to check if it's responsive
      await this.redisClient.ping();
      return this.getStatus(key, true);
    } catch (error) {
      throw new HealthCheckError('Redis check failed', this.getStatus(key, false, { message: error.message }));
    }
  }
}
