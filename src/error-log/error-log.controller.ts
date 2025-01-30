import { Controller, Get, Query } from '@nestjs/common';
import { ErrorLogService } from './error-log.service';

@Controller('error-logs')
export class ErrorLogController {
  constructor(private readonly errorLogService: ErrorLogService) {}

  @Get()
  async findAll(
    @Query('service') service?: string,
    @Query('severity') severity?: string,
  ) {
    return this.errorLogService.findAll({ service, severity });
  }
}
