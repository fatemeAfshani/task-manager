import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository) private taskRepository: TaskRepository,
  ) {}

  async getTasks(searchFilter: GetTasksFilterDto): Promise<Task[]> {
    return this.taskRepository.getTasks(searchFilter);
  }
  async getATask(id: number): Promise<Task> {
    const record = await this.taskRepository.findOne({ where: { id } });

    if (!record) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
    return record;
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskRepository.createTask(createTaskDto);
  }
  async deleteATask(id: number): Promise<void> {
    const isDeleted = await this.taskRepository.delete(id);
    if (isDeleted.affected === 0)
      throw new NotFoundException(`task with id ${id} not found`);
  }
  async updateStatusOfATask(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getATask(id);
    task.status = status;
    await task.save();
    return task;
  }
}
