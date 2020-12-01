import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { TaskStatusValidationPipe } from '../pipes/task-status.validation.pipe';
import { TaskStatus } from '../task.status.enum';

export class GetTasksFilteDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatusValidationPipe;

  @IsOptional()
  search: string;
}
