import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logger/app.logger';
import { Severity } from '../common/enums/severity.enum';
import { ErrorLogService } from 'src/error-log/error-log.service';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class ExceptionMiddleware implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
        private readonly errorLogService: ErrorLogService,
      ) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const logger = new AppLogger(
        { functionName: 'ExceptionMiddleware.catch', requestBody: ctx.getRequest().body },
        this.errorLogService,
      )

    logger.add({
      action: 'UnhandledException',
      message: exception.message || 'Unexpected error',
      severity: Severity.ERROR,
      service: 'Unknown',
    });

    logger.print();

    const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal Server Error',
    });
  }
}
