import { Matches } from 'class-validator';
import { User } from '../auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskStatus } from './task.status.enum';

@Entity()
export class Task extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  status: TaskStatus;

  @ManyToMany((type) => User, (user) => user.tasks)
  user: User;

  @Column()
  userId: number;
}
