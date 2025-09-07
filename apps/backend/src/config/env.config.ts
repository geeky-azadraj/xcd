import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class EnvConfig {
  @IsNotEmpty()
  @IsNumber()
  PORT: number;

  @IsNotEmpty()
  @IsString()
  NODE_ENV: string;

  @IsNotEmpty()
  @IsString()
  CORS_ORIGINS: string;

  @IsNotEmpty()
  @IsNumber()
  PROMETHEUS_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  PROMETHEUS_PUSH_GATEWAY_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  PROMTAIL_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  NODE_EXPORTER_PORT: number;

  @IsNotEmpty()
  @IsString()
  NESTJS_METRICS_TARGET: string;

  @IsNotEmpty()
  @IsString()
  NODE_EXPORTER_TARGET: string;

  @IsNotEmpty()
  @IsNumber()
  GRAFANA_PORT: number;

  @IsNotEmpty()
  @IsString()
  GRAFANA_ADMIN_PASSWORD: string;

  @IsNotEmpty()
  @IsNumber()
  LOKI_PORT: number;

  @IsNotEmpty()
  @IsString()
  LOKI_API_TOKEN: string;

  @IsNotEmpty()
  @IsNumber()
  OTLP_PORT: number;

  @IsNotEmpty()
  @IsString()
  OTEL_SERVICE_NAME: string;

  @IsNotEmpty()
  @IsString()
  OTEL_EXPORTER_OTLP_ENDPOINT: string;

  @IsNotEmpty()
  @IsNumber()
  JAEGER_PORT: number;

  @IsNotEmpty()
  @IsNumber()
  JAEGER_COLLECTOR_PORT: number;

  @IsNotEmpty()
  @IsString()
  JAGER_URL: string;

  @IsNotEmpty()
  @IsString()
  REDIS_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  REDIS_PORT: number;

  @IsNotEmpty()
  @IsString()
  REDIS_PASSWORD: string;

  @IsNotEmpty()
  @IsBoolean()
  REDIS_TLS_ENABLED: boolean;

  @IsNotEmpty()
  @IsString()
  MYSQL_DB: string;

  @IsNotEmpty()
  @IsString()
  MYSQL_USER: string;

  @IsNotEmpty()
  @IsString()
  MYSQL_PASSWORD: string;

  @IsNotEmpty()
  @IsString()
  MYSQL_HOST: string;

  @IsNotEmpty()
  @IsNumber()
  MYSQL_PORT: number;

  @IsNotEmpty()
  @IsString()
  DATABASE_URL: string;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE: number;

  @IsNotEmpty()
  @IsNumber()
  DEFAULT_PAGE_SIZE: number;

  @IsNotEmpty()
  @IsString()
  GRAFANA_URL: string;

  @IsNotEmpty()
  @IsString()
  APP_LOGS_URL: string;

  @IsNotEmpty()
  @IsString()
  DEV_DOCS_URL: string;

  @IsNotEmpty()
  @IsString()
  SERVICES_HEALTH_URL: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_MAPS_API_KEY: string;

  @IsString()
  SUPPORTED_COUNTRIES: string;

  @IsString()
  ALLOWED_COUNTRIES: string;

  // JWT Configuration
  @IsNotEmpty()
  @IsString()
  JWT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_EXPIRES_IN: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsNotEmpty()
  @IsString()
  JWT_REFRESH_EXPIRES_IN: string;

  // SSO Provider Configuration (Optional - only configure the providers you want to use)
  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CLIENT_SECRET: string;

  @IsNotEmpty()
  @IsString()
  FRONTEND_URL: string;

  @IsNotEmpty()
  @IsString()
  GOOGLE_CALLBACK_URL: string;
}
