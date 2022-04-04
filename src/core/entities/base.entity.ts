import { BaseEntity as AbstractEntity } from '@hodfords/typeorm-helper';
import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TimestampTransformer } from '../transformers/timestamp.transformer';

export abstract class BaseEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp',
    transformer: new TimestampTransformer(),
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    transformer: new TimestampTransformer(),
  })
  updatedAt: Date;
}
