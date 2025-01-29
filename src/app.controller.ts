import { Controller, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('app')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post(':id')
  getHello(@Param('id') id: string) {
    return this.appService.getHello(id);
  }
  
  @Get()
  testRoute() {
    return 'API funcionando en /app';
  }
}
