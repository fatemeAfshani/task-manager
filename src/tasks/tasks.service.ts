import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(searchFilter: GetTasksFilterDto, user: User): Promise<Task[]> {
    return this.taskRepository.getTasks(searchFilter, user);
  }
  async getATask(id: number, user: User): Promise<Task> {
    const record = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });

    if (!record) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
    return record;
  }

  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto, user);
  }
  async deleteATask(id: number, user: User): Promise<void> {
    this.logger.verbose(`user ${user.username} trying to delete task ${id}`);
    const isDeleted = await this.taskRepository.delete({ id, userId: user.id });
    if (isDeleted.affected === 0)
      throw new NotFoundException(`task with id ${id} not found`);
  }
  async updateStatusOfATask(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    this.logger.verbose(`user ${user.username} trying to update task ${id}`);

    const task = await this.getATask(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
