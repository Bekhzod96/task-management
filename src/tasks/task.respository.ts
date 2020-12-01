import { identity } from 'rxjs';
import { EntityRepository, Repository } from 'typeorm';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilteDto): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');
    if (status) {
      query.andWhere('task.status = :status', { status });
    }
    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }
    const tasks = await query.getMany();
    return tasks;
  }
}
