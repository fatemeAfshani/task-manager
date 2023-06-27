import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTasks(
    @Query(ValidationPipe) searchFilter: GetTasksFilterDto,
  ): Promise<Task[]> {
    return this.taskService.getTasks(searchFilter);
  }

  @Get(':id')
  getATask(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskService.getATask(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    // @Body('title') title: string,
    // @Body('description') description: string,
    @Body() createTaskDto: CreateTaskDto,
  ): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  @Delete(':id')
  deleteATask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteATask(id);
  }

  @Patch(':id/status')
  updateStatusOfATask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return this.taskService.updateStatusOfATask(id, status);
  }
}
