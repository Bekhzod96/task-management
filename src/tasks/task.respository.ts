import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { Task } from './task.entity';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  async getTasks(filterDto: GetTasksFilteDto, user: User): Promise<Task[]> {
    const { status, search } = filterDto;
    const query = this.createQueryBuilder('task');

    query.where('task.userId = :userId', { userId: user.id });
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
