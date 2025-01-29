import { Severity } from '../enums/severity.enum';
import { AppLogger } from '../../logger/app.logger';

export function LogAction(action: string, service: string): MethodDecorator {
  return (target, key, descriptor: TypedPropertyDescriptor<any>) => {
    const originalMethod = descriptor.value;
    const methodName = String(key);

    descriptor.value = function (...args: any[]) {
      const logger: AppLogger = args[args.length - 1];

      if (!logger || !(logger instanceof AppLogger)) {
        throw new Error('Logger no encontrado.');
      }

      try {
        const result = originalMethod.apply(this, args);

        if (result instanceof Promise) {
          return result
            .then((res) => {
              logger.add({ action, message: `${methodName} success`, severity: Severity.INFO, service });
              return res;
            })
            .catch((err) => {
              logger.add({ action, message: `${methodName} error`, severity: Severity.ERROR, service });
              throw err;
            });
        }

        logger.add({ action, message: `${methodName} success`, severity: Severity.INFO, service });
        return result;
      } catch (err) {
        logger.add({ action, message: `${methodName} error`, severity: Severity.ERROR, service });
        throw err;
      }
    };

    return descriptor;
  };
}
