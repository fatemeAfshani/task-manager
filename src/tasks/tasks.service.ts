import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasks({ search, status }: GetTasksFilterDto): Task[] {
    let tasks = [...this.tasks];
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  getATask(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);
    if (!found) {
      throw new NotFoundException(`task with id ${id} not found`);
    }
    return found;
  }

  createTask({ title, description }: CreateTaskDto): Task {
    const task: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteATask(id: string): void {
    const found = this.getATask(id);
    this.tasks = this.tasks.filter((task) => task.id !== found.id);
  }

  updateStatusOfATask(id: string, status: TaskStatus): Task {
    const task = this.getATask(id);
    task.status = status;
    return task;
  }
}
