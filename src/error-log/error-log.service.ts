import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ErrorLog } from './error-log.entity';
import { Severity } from 'src/common/enums/severity.enum';

@Injectable()
export class ErrorLogService {
  constructor(
    @InjectRepository(ErrorLog)
    private readonly errorLogRepository: Repository<ErrorLog>,
  ) {}

  async findAll(filters: { service?: string; severity?: string }) {
    const queryBuilder = this.errorLogRepository.createQueryBuilder('errorLog');

    if (filters.service) {
      queryBuilder.andWhere('errorLog.service = :service', { service: filters.service });
    }

    if (filters.severity) {
      queryBuilder.andWhere('errorLog.severity = :severity', { severity: filters.severity });
    }

    return queryBuilder.getMany();
  }

  async createLog(logData: {
    service: string;
    severity: Severity;
    message: string;
    detail: string;
  }): Promise<ErrorLog> {
    const newLog = this.errorLogRepository.create(logData);
    return this.errorLogRepository.save(newLog);
  }
}
