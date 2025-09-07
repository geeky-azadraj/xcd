import { RouteNames } from '@common/route-names';
import { HealthService } from '@health/health.service';
import { Controller, Get } from '@nestjs/common';
import { ApiExcludeController, ApiExcludeEndpoint, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheck } from '@nestjs/terminus';

@Controller(RouteNames.HEALTH)
@ApiTags('Health')
// @ApiExcludeController()
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check the health of the service',
    description: 'Health check endpoint',
  })
  async check() {
    return this.healthService.checkHealth();
  }

  @Get(RouteNames.HEALTH_UI)
  @ApiExcludeEndpoint()
  async showHealth() {
    const raw = await this.healthService.checkHealth();
    return {
      status: 'success',
      message: 'Health UI endpoint',
      data: {
        status: raw.status,
        info: raw.info,
        user: 'Developer',
      },
    };
  }
}
