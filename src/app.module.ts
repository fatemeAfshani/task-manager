import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormOptions } from './config/typeorm.config';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [TypeOrmModule.forRoot(typeormOptions), TasksModule],
})
export class AppModule {}
