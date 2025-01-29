import { mkdirSync, existsSync } from 'fs';
import { deleteKey } from 'object-delete-key';
import { pino, destination } from 'pino';
import { v4 as uuidv4 } from 'uuid';
import { Step, TraceDetails } from '../common/interfaces/step.interface';
import { Severity } from '../common/enums/severity.enum';

export class AppLogger {
  public static appName = '';
  public static appVersion = '';
  public static environment = '';
  public static filePath = '';

  public functionName = '';
  public requestBody: any = {};
  public traceDetails: TraceDetails = {};
  public uniqueId = uuidv4();
  public trackId = uuidv4();
  public steps: Step[] = [];
  public timer = process.hrtime();
  public timeCheckPoint: [number, number] = [0, 0];

  constructor({ functionName = '', requestBody = {} }) {
    this.functionName = functionName;
    this.requestBody = requestBody;

    // Crear el directorio de logs si no existe
    if (AppLogger.filePath && AppLogger.filePath.includes('/')) {
      const logsDir = AppLogger.filePath.substring(0, AppLogger.filePath.lastIndexOf('/'));
      if (!existsSync(logsDir)) {
        mkdirSync(logsDir, { recursive: true }); // Crea el directorio recursivamente
      }
    }
  }

  add(step: Step) {
    const elapsedTime = process.hrtime(this.timer);
    step.elapsedTime = elapsedTime[0] * 1000 + elapsedTime[1] / 1000000;
    step.sequence = this.steps.length + 1;
    this.steps.push(step);
    this.timeCheckPoint = elapsedTime;
  }

  print() {
    let logger = pino(destination({ sync: false }));

    if (AppLogger.filePath?.endsWith('.json')) {
      logger = pino(destination({ dest: AppLogger.filePath, sync: false }));
    }

    const error = this.steps.find((step) => step.severity === Severity.ERROR);
    const hasWarning = this.steps.some((step) => step.severity === Severity.WARNING);

    const severity = error ? Severity.ERROR : hasWarning ? Severity.WARNING : Severity.INFO;
    const transformSteps = this.steps.reduce((acc, step) => {
      acc[step.action] = step;
      return acc;
    }, {});

    const log = {
      appName: AppLogger.appName,
      environment: AppLogger.environment,
      functionName: this.functionName,
      trackId: this.trackId,
      uniqueId: this.uniqueId,
      steps: transformSteps,
      requestBody: this.requestBody,
      severity,
    };

    if (error) {
      logger.error(log);
    } else if (hasWarning) {
      logger.warn(log);
    } else {
      logger.info(log);
    }
  }
}
