import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class ErrorLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  service: string;

  @Column()
  method: string;

  @Column('text')
  message: string;

  @Column({ type: 'text', nullable: true })
  stack?: string;

  @CreateDateColumn()
  createdAt: Date;
}
