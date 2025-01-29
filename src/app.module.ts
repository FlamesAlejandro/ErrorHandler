import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ErrorLog } from './error-log/error-log.entity'
import { ErrorLogService } from './error-log/error-log.service';
import { ErrorLogModule } from './error-log/error-log.module'

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
  providers: [AppService, ErrorLogService],
})
export class AppModule {}
