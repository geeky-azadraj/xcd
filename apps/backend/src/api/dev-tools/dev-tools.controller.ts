import { RouteNames } from '@common/route-names';
import { EnvConfig } from '@config/env.config';
import { Controller, Get, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller(RouteNames.DEV_TOOLS)
@ApiTags('Dev Tools')
@ApiExcludeController()
export class DevToolsController {
  private readonly jaegerUrl;
  private readonly grafanaUrl;
  private readonly appLogsUrl;
  private readonly apiDocsUrl;
  private readonly devDocsUrl;
  private readonly bullBoardUrl;
  private readonly systemHealthUrl;

  constructor(private readonly configService: ConfigService<EnvConfig>) {
    this.grafanaUrl = this.configService.get('GRAFANA_URL') || 'http://localhost:3001';
    this.appLogsUrl = this.configService.get('APP_LOGS_URL') || 'https://localhost:3000';
    this.devDocsUrl = this.configService.get('DEV_DOCS_URL') || 'https://localhost:3100';
    this.systemHealthUrl = this.configService.get('SERVICES_HEALTH_URL') || '/v1/health/health-ui';
    this.jaegerUrl = this.configService.get('JAGER_URL') || 'http://localhost:16686';
    this.apiDocsUrl = `/${RouteNames.API_DOCS}`;
    this.bullBoardUrl = `/${RouteNames.QUEUES_UI}`;
  }

  @Get()
  showTools(@Res() res: Response) {
    const tools = [
      { name: 'Grafana', url: this.grafanaUrl, icon: 'grafana.png' },
      { name: 'Jaeger', url: this.jaegerUrl, icon: 'jaeger.png' },
      {
        name: 'Application Logs',
        url: this.appLogsUrl,
        icon: 'logs.png',
      },
      { name: 'System Health', url: this.systemHealthUrl, icon: 'health.png' },
      { name: 'Dev Docs', url: this.devDocsUrl, icon: 'docs.png' },
      { name: 'API Docs', url: this.apiDocsUrl, icon: 'swagger.png' },
      { name: 'Bull Board', url: this.bullBoardUrl, icon: 'bull.png' },
    ];

    return res.json({
      status: 'success',
      message: 'Dev Tools endpoint',
      data: {
        title: 'Dev Tools',
        tools,
        user: 'Developer',
      },
    });
  }
}
