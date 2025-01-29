import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { AppLogger } from './logger/app.logger';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  async getHello(): Promise<string> {
    return this.appService.getHello();
  }
  
  @Get('do-something')
  async doSomething(): Promise<string> {
    const logger = new AppLogger({ functionName: 'AppController.doSomething' });
    return this.appService.doSomething(logger);
  }
}
