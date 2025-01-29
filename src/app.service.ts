import { Injectable } from '@nestjs/common';
import { ErrorLogService } from './error-log/error-log.service';

@Injectable()
export class AppService {
  constructor(private readonly errorLogService: ErrorLogService) {}
  async getHello(id: string) {
    try {
      throw new Error(`No se encontró el usuario con ID ${id}`);
    } catch (error) {
      await this.errorLogService.logError('UsersService', 'getUserById', error);
      throw error;
    }
  }
}
