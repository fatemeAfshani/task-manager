import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { TaskStatus } from '../task-status.enum';

@Injectable()
export class TaskStatusValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (!this.isValidStatus(value)) {
      throw new BadRequestException(`${value} is not valid status`);
    }
    return value;
  }

  isValidStatus(status: any): boolean {
    return Object.values(TaskStatus).includes(status) ? true : false;
  }
}
