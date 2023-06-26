import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query() searchFilter: GetTasksFilterDto): Task[] {
    if (Object.keys(searchFilter).length) {
      return this.taskService.getTasks(searchFilter);
    }
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  getATask(@Param('id') id: string): Task {
    const task = this.taskService.getATask(id);
    if (!task) throw new HttpException('task not found', HttpStatus.NOT_FOUND);

    return task;
  }

  @Post()
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Task {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteATask(@Param('id') id: string): void {
    this.taskService.deleteATask(id);
    return;
  }

  @Patch(':id/status')
  updateStatusOfATask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateStatusOfATask(id, status);
  }
}
