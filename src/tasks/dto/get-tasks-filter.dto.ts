import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { TaskStatus } from '../task-status.enum';

export class GetTasksFilterDto {
  @ApiProperty({
    description: 'one of 3 task status: open, in_progress, done',
    required: false,
    enum: ['open', 'in_progress', 'done'],
  })
  @IsOptional()
  @IsIn(Object.values(TaskStatus))
  status: TaskStatus;

  @ApiProperty({
    required: false,
    description: 'search in task title and description ',
    type: String,
  })
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  search: string;
}
