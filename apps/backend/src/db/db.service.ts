import { EnvConfig } from '@config/env.config';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DBService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private mysqlConnection: mysql.Connection | null = null;

  constructor(config: ConfigService<EnvConfig>) {
    const databaseUrl = config.get<string>('DATABASE_URL');
    console.log('Connecting to MySQL with URL:', databaseUrl);

    super({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    });
  }

  async onModuleInit() {
    console.log('Initializing MySQL connection...');
    await this.$connect();
    
    // Optional: Create MySQL connection for custom queries if needed
    try {
      const databaseUrl = process.env.DATABASE_URL;
      if (databaseUrl) {
        const url = new URL(databaseUrl);
        this.mysqlConnection = await mysql.createConnection({
          host: url.hostname,
          port: parseInt(url.port) || 3306,
          user: url.username || 'root',
          password: url.password || '',
          database: url.pathname.slice(1), // Remove leading slash
        });
      }
    } catch (error) {
      console.log('Direct MySQL connection not established:', error.message);
    }
    
    console.log('MySQL connection established');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    if (this.mysqlConnection) {
      await this.mysqlConnection.end();
    }
  }
}