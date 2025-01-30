import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { Severity } from '../common/enums/severity.enum';

@Entity('error_log')
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column({
    type: 'enum',
    enum: Severity,
  })
  severity: Severity;

  @Column()
  message: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  @CreateDateColumn()
  timestamp: Date;
}
