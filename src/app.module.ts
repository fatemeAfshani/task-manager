import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptions } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { DbModule } from './utils/db/db.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeormOptions),
    TasksModule,
    UsersModule,
    DbModule,
  ],
})
export class AppModule {}
