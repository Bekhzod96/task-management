import { User } from 'src/auth/user.entity';
import { EntityRepository, Repository } from 'typeorm';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { Task } from './task.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRespository extends Repository<Task> {
  private logger = new Logger();
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
    try {
      const tasks = await query.getMany();
      return tasks;
    } catch (err) {
      this.logger.error(
        `Faild to get tasks for user "${
          user.username
        }", Filters: ${JSON.stringify(filterDto)} `,
        err.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
