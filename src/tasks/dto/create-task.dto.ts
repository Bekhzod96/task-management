import { isNotEmpty, isString } from 'class-validator';

export class CreateTaskDto {
  title: string;

  description: string;
}
