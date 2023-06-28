import { Injectable } from '@nestjs/common';
import { TaskRepository } from '../../tasks/task.repository';
import { UserRepository } from '../../users/user.repository';

@Injectable()
export class DbProvider {
  constructor(
    private userRepository: UserRepository,
    private taskRepository: TaskRepository,
  ) {}
  async clearDB() {
    await this.taskRepository.delete({});
    await this.userRepository.delete({});
  }
}
