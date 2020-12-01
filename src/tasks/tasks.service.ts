import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { Task } from './task.entity';
import { TaskRespository } from './task.respository';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {
  logger = new Logger('TaskService');
  constructor(
    @InjectRepository(TaskRespository)
    private taskRepository: TaskRespository,
  ) {}

  getTasks(filterDto: GetTasksFilteDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto, user);
  }
  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotAcceptableException(`This Task #${id} not found`);
    }
    return found;
  }

  async createTask(createTaskDto: CreateTaskDto, user): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    task.userId = user.id;
    try {
      await task.save();
    } catch (err) {
      this.logger.error(
        `Failed to create a task user "${user.username}". Date: ${createTaskDto}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
    return task;
  }

  async removeTaskById(id: number, user: User): Promise<void> {
    const task = await this.taskRepository.findOne(id);
    if (task.userId !== user.id) {
      throw new NotAcceptableException(`Task #${id} not found`);
    }

    try {
      await this.taskRepository.delete(id);
    } catch (err) {
      this.logger.error(
        `Failed to delete a task for "${user.username}". Task: ${id}`,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }

  async updateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
