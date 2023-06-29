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
    const userDto2: UserCredentialsDto = {
      username: 'fateme2',
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
      it('successful signup user2', () => {
        return pactum
          .spec()
          .post(`/users/signup`)
          .withBody(userDto2)
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
      it('successful signin', () => {
        return pactum
          .spec()
          .post(`/users/signin`)
          .withBody(userDto2)
          .expectStatus(200)
          .stores('userToken2', 'accessToken');
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
    const invalidId = 9999999;

    const taskDto: CreateTaskDto = {
      title: 'sample task',
      description: 'this is sample task',
    };

    const taskDto2: CreateTaskDto = {
      title: 'random task',
      description: 'this is random task',
    };
    describe('create task', () => {
      it('successful create a task', () => {
        return pactum
          .spec()
          .post(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(taskDto)
          .expectStatus(201)
          .expectBodyContains(taskDto.title)
          .stores('taskId', 'id');
      });
      it('successful create another task', () => {
        return pactum
          .spec()
          .post(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody(taskDto2)
          .expectStatus(201)
          .expectBodyContains(taskDto2.title)
          .stores('taskId2', 'id');
      });
      it('should throw error if title is empty', () => {
        return pactum
          .spec()
          .post(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({
            description: taskDto.description,
          })
          .expectStatus(400);
      });

      it('should throw error if description is empty', () => {
        return pactum
          .spec()
          .post(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({
            title: taskDto.title,
          })
          .expectStatus(400);
      });
    });

    describe('get task by id', () => {
      it('successful get task', () => {
        return pactum
          .spec()
          .get(`/tasks/$S{taskId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200)
          .expectBodyContains(taskDto.title)
          .expectBodyContains(taskDto.description)
          .expectBodyContains('open');
      });

      it('should throw error when task id is not number', () => {
        return pactum
          .spec()
          .get(`/tasks/sample`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(400);
      });

      it('should throw error when task id does not exist', () => {
        return pactum
          .spec()
          .get(`/tasks/${invalidId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(404);
      });
      it('should throw error when task does not belong to this user', () => {
        return pactum
          .spec()
          .get(`/tasks/$S{taskId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(404);
      });
    });

    describe('update task status', () => {
      const status = 'done';
      it('successful edit', () => {
        return pactum
          .spec()
          .patch(`/tasks/$S{taskId}/status`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({ status })
          .expectStatus(200);
      });

      it('throw error if task does not belong to this user', () => {
        return pactum
          .spec()
          .patch(`/tasks/$S{taskId}/status`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .withBody({ status })
          .expectStatus(404);
      });

      it('throw error if task does not exist', () => {
        return pactum
          .spec()
          .patch(`/tasks/${invalidId}/status`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({ status })
          .expectStatus(404);
      });
      it('should throw an error if task status is not valid', () => {
        return pactum
          .spec()
          .patch(`/tasks/${invalidId}/status`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({ status: ' invalid status' })
          .expectStatus(400);
      });
      it('should trow error task id is not number ', () => {
        return pactum
          .spec()
          .patch(`/tasks/sample/status`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .withBody({ status })
          .expectStatus(400);
      });
    });

    describe('get all tasks', () => {
      it('get all tasks of user1', async () => {
        const { body } = await pactum
          .spec()
          .get(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);

        expect(body).toHaveLength(2);
      });

      it('return empty array for user2 task', async () => {
        const { body } = await pactum
          .spec()
          .get(`/tasks`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(200);
        expect(body).toHaveLength(0);
      });

      it('get tasks with status filter', async () => {
        const { body } = await pactum
          .spec()
          .get(`/tasks?status=open`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);

        expect(body).toHaveLength(1);
      });

      it('get tasks with search filter', async () => {
        const { body } = await pactum
          .spec()
          .get(`/tasks?search=random`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);

        expect(body).toHaveLength(1);
      });

      it('get tasks with both status and search filter', async () => {
        const { body } = await pactum
          .spec()
          .get(`/tasks?search=sample&status=done`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);

        expect(body).toHaveLength(1);
      });

      it('throw error if status filter is invalid', () => {
        return pactum
          .spec()
          .get(`/tasks?status=invalid`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(400);
      });

      it('throw error if search filter is empty', () => {
        return pactum
          .spec()
          .get(`/tasks?search=`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(400);
      });
    });

    describe('delete task', () => {
      it('successful delete', () => {
        return pactum
          .spec()
          .delete(`/tasks/$S{taskId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(200);
      });

      it('throw error if task does not exist', () => {
        return pactum
          .spec()
          .delete(`/tasks/$S{invalidId}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken}',
          })
          .expectStatus(404);
      });
      it('throw error if task does not belong to user', () => {
        return pactum
          .spec()
          .delete(`/tasks/$S{taskId2}`)
          .withHeaders({
            Authorization: 'Bearer $S{userToken2}',
          })
          .expectStatus(404);
      });
    });
  });
});
