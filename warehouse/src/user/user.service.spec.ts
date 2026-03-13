import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import {
  NotFoundException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

import * as bcrypt from 'bcrypt';

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
    (bcrypt.hash as jest.Mock).mockClear();
    (bcrypt.compare as jest.Mock).mockClear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user with hashed password', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser: User = {
        id: 1,
        email: createUserDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: createUserDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers: User[] = [
        {
          id: 1,
          email: 'test1@example.com',
          password: 'hashed1',
          firstName: null,
          lastName: null,
          middleName: null,
          position: null,
          department: null,
          permission: null,
          role: UserRole.MANAGER,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          email: 'test2@example.com',
          password: 'hashed2',
          firstName: null,
          lastName: null,
          middleName: null,
          position: null,
          department: null,
          permission: null,
          role: UserRole.MANAGER,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(999)).rejects.toThrow(
        'User with ID 999 not found',
      );
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const existingUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'oldHashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        firstName: 'John',
        lastName: 'Doe',
      };

      const updatedUser: User = {
        ...existingUser,
        firstName: updateUserDto.firstName || null,
        lastName: updateUserDto.lastName || null,
      };

      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.update(1, updateUserDto);

      expect(mockRepository.save).toHaveBeenCalled();
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
    });

    it('should hash password when updating password', async () => {
      const existingUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'oldHashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updateUserDto: UpdateUserDto = {
        password: 'newPassword123',
      };

      const newHashedPassword = 'newHashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(newHashedPassword);
      mockRepository.findOne.mockResolvedValue(existingUser);
      mockRepository.save.mockResolvedValue({
        ...existingUser,
        password: newHashedPassword,
      });

      await service.update(1, updateUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword123', 10);
      expect(mockRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ password: newHashedPassword }),
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.update(999, {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.remove(1);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockUser: User = {
        id: 1,
        email: 'test@example.com',
        password: 'hashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('register', () => {
    it('should register a new user and return user with access token', async () => {
      const registerDto: RegisterDto = {
        email: 'newuser@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser: User = {
        id: 1,
        email: registerDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accessToken = 'jwt-token-123';

      mockRepository.findOne.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.register(registerDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);
      expect(mockRepository.create).toHaveBeenCalledWith({
        email: registerDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
      });
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: mockUser,
        accessToken,
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
      };

      const existingUser: User = {
        id: 1,
        email: registerDto.email,
        password: 'hashed',
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(service.register(registerDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(mockRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should login user and return user with access token', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser: User = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const accessToken = 'jwt-token-123';

      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.sign.mockReturnValue(accessToken);

      const result = await service.login(loginDto);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        hashedPassword,
      );
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        sub: mockUser.id,
        email: mockUser.email,
      });
      expect(result).toEqual({
        user: mockUser,
        accessToken,
      });
    });

    it('should throw UnauthorizedException when user not found', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid email or password',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when password is invalid', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser: User = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'Invalid email or password',
      );
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser: User = {
        id: 1,
        email: loginDto.email,
        password: hashedPassword,
        firstName: null,
        lastName: null,
        middleName: null,
        position: null,
        department: null,
        permission: null,
        role: UserRole.MANAGER,
        isActive: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(service.login(loginDto)).rejects.toThrow(
        'User account is inactive',
      );
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(mockJwtService.sign).not.toHaveBeenCalled();
    });
  });
});
