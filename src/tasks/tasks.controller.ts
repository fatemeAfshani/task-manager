import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(@Query(ValidationPipe) searchFilter: GetTasksFilterDto): Task[] {
    if (Object.keys(searchFilter).length) {
      return this.taskService.getTasks(searchFilter);
    }
    return this.taskService.getAllTasks();
  }

  @Get(':id')
  getATask(@Param('id') id: string): Task {
    return this.taskService.getATask(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
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
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Task {
    return this.taskService.updateStatusOfATask(id, status);
  }
}
