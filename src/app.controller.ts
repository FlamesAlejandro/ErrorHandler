import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLogger } from './logger/app.logger';
import { ErrorLogService } from './error-log/error-log.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService,
    private readonly errorLogService: ErrorLogService
  ) {}

  @Get('hello')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
  
  @Get('do-something')
  async doSomething(): Promise<string> {
    const logger = new AppLogger(
      { functionName: 'AppController.doSomething' },
      this.errorLogService,
    );
    return this.appService.doSomething(logger);
  }
}
