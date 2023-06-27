import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';

export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'fateme',
  password: 'aztprsst',
  database: 'taskmanagement',
  synchronize: true,
  logging: true,
  entities: [Task],
  subscribers: [],
  migrations: [],
};
