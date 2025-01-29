import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ErrorLog } from './error-log/error-log.entity'
import { ErrorLogService } from './error-log/error-log.service';
import { ErrorLogModule } from './error-log/error-log.module'
import { APP_FILTER } from '@nestjs/core'
import { ExceptionMiddleware } from './middleware/exception.middleware'
import { AppLogger } from './logger/app.logger'

@Module({
  imports: [
    ErrorLogModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST'),
        port: +config.get<number>('DB_PORT', 3306),
        username: config.get('DB_USER'),
        password: config.get('DB_PASS'),
        database: config.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
        uuidExtension: null,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ErrorLogService,{
    provide: APP_FILTER,
    useClass: ExceptionMiddleware,
  },],
})
export class AppModule {constructor() {
  AppLogger.appName = 'ErrorHandlerApp';
  AppLogger.appVersion = '1.0.0';
  AppLogger.environment = process.env.NODE_ENV || 'development';
  AppLogger.filePath = './logs/app-logs.json';
}}
