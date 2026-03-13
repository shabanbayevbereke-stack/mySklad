import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '../src/user/user.entity';
import * as bcrypt from 'bcrypt';

describe('UserController (e2e)', () => {
  let app: INestApplication<App>;
  let userRepository: Repository<User>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await userRepository.clear();
  });

  describe('POST /users', () => {
    it('should create a user', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201)
        .expect((res) => {
          const body = res.body as User;
          expect(body).toHaveProperty('id');
          expect(body.email).toBe(createUserDto.email);
          expect(body.password).not.toBe(createUserDto.password); // password should be hashed
          expect(body.role).toBe(UserRole.MANAGER);
          expect(body.isActive).toBe(true);
          expect(body.firstName).toBeNull();
          expect(body.lastName).toBeNull();
          expect(body.middleName).toBeNull();
          expect(body.position).toBeNull();
          expect(body.department).toBeNull();
          expect(body.permission).toBeNull();
        });
    });

    it('should return 400 for invalid email', () => {
      const createUserDto = {
        email: 'invalid-email',
        password: 'password123',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });

    it('should return 400 for short password', () => {
      const createUserDto = {
        email: 'test@example.com',
        password: '12345',
      };

      return request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(400);
    });
  });

  describe('GET /users', () => {
    it('should return an array of users', async () => {
      // Create test users
      const user1 = userRepository.create({
        email: 'user1@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      const user2 = userRepository.create({
        email: 'user2@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      await userRepository.save([user1, user2]);

      return request(app.getHttpServer())
        .get('/users')
        .expect(200)
        .expect((res) => {
          const body = res.body as User[];
          expect(Array.isArray(body)).toBe(true);
          expect(body.length).toBeGreaterThanOrEqual(2);
        });
    });
  });

  describe('GET /users/:id', () => {
    it('should return a user by id', async () => {
      const user = userRepository.create({
        email: 'getuser@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      const savedUser = await userRepository.save(user);

      return request(app.getHttpServer())
        .get(`/users/${savedUser.id}`)
        .expect(200)
        .expect((res) => {
          const body = res.body as User;
          expect(body.id).toBe(savedUser.id);
          expect(body.email).toBe(savedUser.email);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer()).get('/users/99999').expect(404);
    });
  });

  describe('PATCH /users/:id', () => {
    it('should update a user', async () => {
      const user = userRepository.create({
        email: 'updateuser@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      const savedUser = await userRepository.save(user);

      const updateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        position: 'Developer',
      };

      return request(app.getHttpServer())
        .patch(`/users/${savedUser.id}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          const body = res.body as User;
          expect(body.firstName).toBe(updateUserDto.firstName);
          expect(body.lastName).toBe(updateUserDto.lastName);
          expect(body.position).toBe(updateUserDto.position);
        });
    });

    it('should hash password when updating password', async () => {
      const user = userRepository.create({
        email: 'updatepass@example.com',
        password: await bcrypt.hash('oldpassword', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      const savedUser = await userRepository.save(user);

      const updateUserDto = {
        password: 'newpassword123',
      };

      return request(app.getHttpServer())
        .patch(`/users/${savedUser.id}`)
        .send(updateUserDto)
        .expect(200)
        .expect((res) => {
          const body = res.body as User;
          expect(body.password).not.toBe(updateUserDto.password);
          expect(body.password).not.toBe(savedUser.password);
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer())
        .patch('/users/99999')
        .send({ firstName: 'John' })
        .expect(404);
    });
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user', async () => {
      const user = userRepository.create({
        email: 'deleteuser@example.com',
        password: await bcrypt.hash('password123', 10),
        role: UserRole.MANAGER,
        isActive: true,
      });
      const savedUser = await userRepository.save(user);

      return request(app.getHttpServer())
        .delete(`/users/${savedUser.id}`)
        .expect(200)
        .then(async () => {
          const deletedUser = await userRepository.findOne({
            where: { id: savedUser.id },
          });
          expect(deletedUser).toBeNull();
        });
    });

    it('should return 404 for non-existent user', () => {
      return request(app.getHttpServer()).delete('/users/99999').expect(404);
    });
  });
});
