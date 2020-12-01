import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { throws } from 'assert';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { Task } from './task.entity';
import { TaskRespository } from './task.respository';
import { TaskStatus } from './task.status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRespository)
    private taskRepository: TaskRespository,
  ) {}
  getTasks(filterDto: GetTasksFilteDto): Promise<Task[]> {
    return this.taskRepository.getTasks(filterDto);
  }
  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotAcceptableException(`This Task #${id} not found`);
    }
    return found;
  }
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    const { title, description } = createTaskDto;
    const task = new Task();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
  async removeTaskById(id: number): Promise<void> {
    const task = await this.taskRepository.delete(id);
    if (task.affected === 0) {
      throw new NotAcceptableException(`This Task #${id} not found`);
    }
  }
  async updateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
