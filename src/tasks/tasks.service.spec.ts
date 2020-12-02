import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRespository } from './task.respository';
import { GetTasksFilteDto } from './dto/get-task.filter.dto';
import { TaskStatus } from './task.status.enum';
import { User } from 'src/auth/user.entity';
import { NotFoundException, Delete } from '@nestjs/common';
import { Task } from './task.entity';

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
});

const mockUser: User = {
  id: 1,
  username: 'TestUser',
  password: 'pass',
  salt: 'someslat',
};

describe('Task Service', () => {
  let tasksService: TasksService;
  let taskRepository: TaskRespository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRespository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = module.get<TasksService>(TasksService);
    taskRepository = module.get<TaskRespository>(TaskRespository);
  });
  it('should be defined', () => {
    expect(tasksService).toBeDefined();
    expect(taskRepository).toBeDefined();
  });

  describe('', () => {
    it('get all task form the repository', async () => {
      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      taskRepository.getTasks = jest.fn().mockResolvedValue('TestValue');
      const filters: GetTasksFilteDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Search Term',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('TestValue');
    });
  });

  describe('getTaskById', () => {
    it('calls taskReposiory.getTaskById() and successfully retrive and return task', async () => {
      const mockTask = {
        title: 'Task task',
        description: 'Test Desction',
      };

      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throws an error as task is not found', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('createTask', () => {
    it('calls taskRepository.create() and returns the result ', async () => {
      expect(taskRepository.createTask).not.toHaveBeenCalled();

      const createTaskDto = { title: 'Test task', description: 'Tast desc' };
      tasksService.createTask(createTaskDto, mockUser);
      //need to be continued
    });
  });

  // describe('deleteTask', () => {
  //   it('calls taskRespository.deleteTask() detele task', async () => {
  //     // taskRepository.delete.mockResolvedValue({ effected: 1 });
  //     // expect(taskRepository.delete).not.toHaveBeenCalled();
  //     await tasksService.removeTaskById(1, mockUser);
  //   });

  //   it('trows error when task not found ', () => {});
  // });

  describe('updateTaskStatus', () => {
    it('udate task service', async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.OPEN,
        save,
      });
      expect(tasksService.getTaskById).not.toHaveBeenCalled();
      expect(save).not.toHaveBeenCalled();
      const result = await tasksService.updateTaskStatus(
        1,
        TaskStatus.DONE,
        mockUser,
      );
      expect(tasksService.getTaskById).toHaveBeenCalled();
      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.DONE);
    });
  });
});
