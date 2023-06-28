import { Module } from '@nestjs/common';
import { TasksModule } from '../../tasks/tasks.module';
import { UsersModule } from '../../users/users.module';
import { DbProvider } from './db.provider';

@Module({
  imports: [TasksModule, UsersModule],
  providers: [DbProvider],
  exports: [DbProvider],
})
export class DbModule {}
