import * as config from 'config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Task } from 'src/tasks/task.entity';
import { User } from 'src/users/user.entity';

const { host, port, name, username, password, synchronize } = config.get('db');
export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host,
  port,
  username,
  password,
  database: name,
  synchronize,
  logging: false,
  entities: [Task, User],
  subscribers: [],
  migrations: [],
};
