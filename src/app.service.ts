import { Injectable } from '@nestjs/common';
import { ErrorLogService } from './error-log/error-log.service';
import { AppLogger } from './logger/app.logger';
import { LogAction } from './common/decorators/log-action.decorator';
import { Severity } from './common/enums/severity.enum';

@Injectable()
export class AppService {
  constructor(private readonly errorLogService: ErrorLogService) {}
  async getHello(): Promise<string> {
    // Usamos AppLogger directamente
    const logger = new AppLogger({ functionName: 'getHello' });
    logger.add({ action: 'fetchGreeting', message: 'Fetching greeting', severity: Severity.INFO, service: 'AppService' });
    logger.print();

    return 'Hello World!';
  }

  @LogAction('doSomething', 'AppService') // Usamos el decorador para registrar automáticamente logs
  async doSomething(logger: AppLogger): Promise<string> {
    logger.add({ action: 'start', message: 'Doing something important', severity: Severity.INFO, service: 'AppService' });
    // Simulamos una operación
    if (Math.random() > 0.5) {
      throw new Error('Algo salió mal');
    }
    return 'Operación exitosa';
  }
}
