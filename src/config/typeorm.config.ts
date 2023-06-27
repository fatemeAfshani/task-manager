import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeormOptions: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'fateme',
  password: 'aztprsst',
  database: 'taskmanagement',
  synchronize: true,
  logging: true,
  entities: [__dirname + '../**/*.entity.ts'],
  subscribers: [],
  migrations: [],
};
