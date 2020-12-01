import { Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
@Injectable()
export class TasksService {
  // getAllTasks() {
  //   return this.tasks;
  // }
  // getTaskById(id: string) {
  //   return this.tasks.find((task) => task.id === id);
  // }
  // createTask(createTaskDto: CreateTaskDto): Task {
  //   const { title, description } = createTaskDto;
  //   const task: Task = {
  //     id: uuid(),
  //     title,
  //     description,
  //     status: TaskStatus.OPEN,
  //   };
  //   this.tasks.push(task);
  //   return task;
  // }
  // removeTaskById(id: string): void {
  //   this.tasks = this.tasks.filter((task) => task.id !== id);
  // }
}
