import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { DbProvider } from '../src/utils/db/db.provider';
import * as config from 'config';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let dbProvider: DbProvider;
  const port = config.get('app.port');
  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

    await app.init();
    app.listen(port);
    dbProvider = app.get(DbProvider);
    await dbProvider.clearDB();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('user', () => {
    describe('signup', () => {
      const userDto: UserCredentialsDto = {
        username: 'fateme',
        password: 'Some123@',
      };
      it('successful signup', () => {
        return pactum
          .spec()
          .post(`http://localhost:${port}/users/signup`)
          .withBody(userDto)
          .expectStatus(201);
      });
    });
  });
});
