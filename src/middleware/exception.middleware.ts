import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { AppLogger } from '../logger/app.logger';
import { Severity } from '../common/enums/severity.enum';

@Catch()
export class ExceptionMiddleware implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const logger = new AppLogger({ functionName: 'ExceptionMiddleware.catch', requestBody: request.body });

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
