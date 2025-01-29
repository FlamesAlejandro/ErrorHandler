import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from './error-log.entity';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  async logError(service: string, method: string, error: any) {
    const errorLog = this.errorLogRepository.create({
      service,
      method,
      message: error.message || 'Unknown error',
      stack: error.stack || null,
    })
    await this.errorLogRepository.save(errorLog)
  }
}
