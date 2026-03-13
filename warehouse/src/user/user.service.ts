import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
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

    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    filterDto?: UserFilterDto,
  ): Promise<PaginatedResponse<User>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder('user');

    // Apply filters
    if (filterDto) {
      if (filterDto.email) {
        queryBuilder.andWhere('user.email LIKE :email', {
          email: `%${filterDto.email}%`,
        });
      }
      if (filterDto.firstName) {
        queryBuilder.andWhere('user.firstName LIKE :firstName', {
          firstName: `%${filterDto.firstName}%`,
        });
      }
      if (filterDto.lastName) {
        queryBuilder.andWhere('user.lastName LIKE :lastName', {
          lastName: `%${filterDto.lastName}%`,
        });
      }
      if (filterDto.middleName) {
        queryBuilder.andWhere('user.middleName LIKE :middleName', {
          middleName: `%${filterDto.middleName}%`,
        });
      }
      if (filterDto.position) {
        queryBuilder.andWhere('user.position LIKE :position', {
          position: `%${filterDto.position}%`,
        });
      }
      if (filterDto.department) {
        queryBuilder.andWhere('user.department LIKE :department', {
          department: `%${filterDto.department}%`,
        });
      }
      if (filterDto.role !== undefined) {
        queryBuilder.andWhere('user.role = :role', { role: filterDto.role });
      }
      if (filterDto.isActive !== undefined) {
        queryBuilder.andWhere('user.isActive = :isActive', {
          isActive: filterDto.isActive,
        });
      }
      if (filterDto.createdAtFrom) {
        queryBuilder.andWhere('user.createdAt >= :createdAtFrom', {
          createdAtFrom: filterDto.createdAtFrom,
        });
      }
      if (filterDto.createdAtTo) {
        queryBuilder.andWhere('user.createdAt <= :createdAtTo', {
          createdAtTo: filterDto.createdAtTo,
        });
      }
      if (filterDto.updatedAtFrom) {
        queryBuilder.andWhere('user.updatedAt >= :updatedAtFrom', {
          updatedAtFrom: filterDto.updatedAtFrom,
        });
      }
      if (filterDto.updatedAtTo) {
        queryBuilder.andWhere('user.updatedAt <= :updatedAtTo', {
          updatedAtTo: filterDto.updatedAtTo,
        });
      }
    }

    queryBuilder.orderBy('user.id', 'ASC');
    queryBuilder.skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    const totalPages = Math.ceil(total / limit);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async register(
    registerDto: RegisterDto,
  ): Promise<{ user: User; accessToken: string }> {
    const existingUser = await this.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    const user = this.userRepository.create({
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

    const savedUser = await this.userRepository.save(user);

    const payload = { sub: savedUser.id, email: savedUser.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user: savedUser,
      accessToken,
    };
  }

  async login(
    loginDto: LoginDto,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User account is inactive');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { sub: user.id, email: user.email };
    const accessToken = this.jwtService.sign(payload);

    return {
      user,
      accessToken,
    };
  }
}
