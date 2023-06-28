import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as pactum from 'pactum';
import { AppModule } from './../src/app.module';
import { DbProvider } from '../src/utils/db/db.provider';
import * as config from 'config';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { CreateTaskDto } from 'src/tasks/dto/create-task.dto';

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
    pactum.request.setBaseUrl(`http://localhost:${port}`);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('user', () => {
    const userDto: UserCredentialsDto = {
      username: 'fateme',
      password: 'Some123@',
    };
    describe('signup', () => {
      it('successful signup', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody(userDto)
          .expectStatus(201);
      });
      it('should throw error if username already exist', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody(userDto)
          .expectStatus(409);
      });
      it('should throw error if username is empty', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if username is  less than 3 character', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: '12',
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if username is  more than 20 character', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username:
              '12sddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd',
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if username is not string', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: 1234,
            password: userDto.password,
          })
          .expectStatus(400);
      });
      it('should throw error if password is empty', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: userDto.username,
          })
          .expectStatus(400);
      });
      it('should throw error if password is  less than 6 character', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: userDto.username,
            password: 'As1@',
          })
          .expectStatus(400);
      });
      it('should throw error if password is  more than 20 character', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            password: 'As1@sdddddddddddddddddddddddddddddddddddddddd',
            username: userDto.username,
          })
          .expectStatus(400);
      });
      it('should throw error if username is not string', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: userDto.username,
            password: 123,
          })
          .expectStatus(400);
      });
      it('should throw error if username is weak', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody({
            username: userDto.username,
            password: '123',
          })
          .expectStatus(400);
      });
    });
    describe('signin', () => {
      it('successful signin', () => {
        return pactum
          .spec()
          .post(`/users/signin`)
          .withBody(userDto)
          .expectStatus(200)
          .stores('userToken', 'accessToken');
      });
      it('should throw error if no body is sent', () => {
        return pactum.spec().post(`/users/signin`).expectStatus(400);
      });
      it('should throw error 401 if username does not exist', () => {
        return pactum
          .spec()
          .post(`/users/signin`)
          .withBody({
            username: 'random',
            password: userDto.password,
          })
          .expectStatus(401);
      });
      it('should throw error 401 if password does not match', () => {
        return pactum
          .spec()
          .post(`/users/signin`)
          .withBody({
            username: userDto.username,
            password: 'Radnom12!',
          })
          .expectStatus(401);
      });
    });
  });

  describe('tasks', () => {
    const taskDto: CreateTaskDto = {
      title: 'sample task',
      description: 'this is random task',
    };
    describe('create task', () => {
      it('successful create', () => {
        return pactum
          .spec()
          .post(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(taskDto)
          .expectStatus(201)
          .stores('userToken', 'accessToken');
      });
    });
  });
});
