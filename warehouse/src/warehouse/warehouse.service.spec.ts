import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { Cargo, CargoType } from './cargo.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { AddCargoDto } from './dto/add-cargo.dto';
import { MoveCargoDto } from './dto/move-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

describe('WarehouseService', () => {
  let service: WarehouseService;

  const mockWarehouseRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCargoRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WarehouseService,
        {
          provide: getRepositoryToken(Warehouse),
          useValue: mockWarehouseRepository,
        },
        {
          provide: getRepositoryToken(Cargo),
          useValue: mockCargoRepository,
        },
      ],
    }).compile();

    service = module.get<WarehouseService>(WarehouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      const createDto: CreateWarehouseDto = {
        x: 10,
        y: 10,
        z: 10,
        name: 'Test Warehouse',
        description: 'Test Description',
      };

      const warehouse = { id: 1, ...createDto } as Warehouse;

      mockWarehouseRepository.create.mockReturnValue(warehouse);
      mockWarehouseRepository.save.mockResolvedValue(warehouse);

      const result = await service.create(createDto);

      expect(result).toEqual(warehouse);
      expect(mockWarehouseRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockWarehouseRepository.save).toHaveBeenCalledWith(warehouse);
    });
  });

  describe('findAll', () => {
    it('should return all warehouses', async () => {
      const warehouses = [
        {
          id: 1,
          x: 10,
          y: 10,
          z: 10,
          name: null,
          description: null,
          cargo: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          x: 20,
          y: 20,
          z: 20,
          name: null,
          description: null,
          cargo: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ] as Warehouse[];

      mockWarehouseRepository.find.mockResolvedValue(warehouses);

      const result = await service.findAll();

      expect(result).toEqual(warehouses);
      expect(mockWarehouseRepository.find).toHaveBeenCalledWith({
        relations: ['cargo'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      const warehouse = {
        id: 1,
        x: 10,
        y: 10,
        z: 10,
        name: null,
        description: null,
        cargo: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Warehouse;

      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);

      const result = await service.findOne(1);

      expect(result).toEqual(warehouse);
      expect(mockWarehouseRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['cargo'],
      });
    });

    it('should throw NotFoundException if warehouse not found', async () => {
      mockWarehouseRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const warehouse = {
        id: 1,
        x: 10,
        y: 10,
        z: 10,
        name: 'Old Name',
      } as Warehouse;

      const updateDto: UpdateWarehouseDto = {
        name: 'New Name',
      };

      const updatedWarehouse = { ...warehouse, ...updateDto };

      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockWarehouseRepository.save.mockResolvedValue(updatedWarehouse);

      const result = await service.update(1, updateDto);

      expect(result).toEqual(updatedWarehouse);
      expect(mockWarehouseRepository.save).toHaveBeenCalledWith(
        updatedWarehouse,
      );
    });
  });

  describe('remove', () => {
    it('should remove a warehouse', async () => {
      const warehouse = { id: 1 } as Warehouse;

      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockCargoRepository.count.mockResolvedValue(0);
      mockWarehouseRepository.remove.mockResolvedValue(warehouse);

      await service.remove(1);

      expect(mockCargoRepository.count).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
      });
      expect(mockWarehouseRepository.remove).toHaveBeenCalledWith(warehouse);
    });
  });

  describe('addCargo', () => {
    const warehouse = {
      id: 1,
      x: 100,
      y: 100,
      z: 100,
    } as Warehouse;

    const addCargoDto: AddCargoDto = {
      type: CargoType.CARGO,
      guid: 'test-guid-123',
      name: 'Test Cargo',
      netWeight: 80,
      packWeight: 20,
      sizeX: 10,
      sizeY: 10,
      sizeZ: 10,
      x: 0,
      y: 0,
      z: 0,
    };

    beforeEach(() => {
      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockCargoRepository.findOne.mockResolvedValue(null);
    });

    it('should add cargo to warehouse', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockCargoRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const cargo = {
        id: 1,
        ...addCargoDto,
        totalWeight:
          Number(addCargoDto.netWeight) + Number(addCargoDto.packWeight),
        warehouseId: 1,
        storageDate: new Date(),
        containSizeX: null,
        containSizeY: null,
        containSizeZ: null,
        maxLoadWeight: null,
      } as Cargo;

      mockCargoRepository.create.mockReturnValue(cargo);
      mockCargoRepository.save.mockResolvedValue(cargo);

      const result = await service.addCargo(1, addCargoDto);

      expect(result).toEqual(cargo);
      expect(mockCargoRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if guid already exists', async () => {
      const existingCargo = { id: 1, guid: 'test-guid-123' } as Cargo;
      mockCargoRepository.findOne.mockResolvedValue(existingCargo);

      await expect(service.addCargo(1, addCargoDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadRequestException if cargo does not fit', async () => {
      const largeCargo: AddCargoDto = {
        ...addCargoDto,
        x: 95,
        sizeX: 10,
      };

      await expect(service.addCargo(1, largeCargo)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should validate container sizes for container type', async () => {
      const containerDto: AddCargoDto = {
        ...addCargoDto,
        type: CargoType.CONTAINER,
      };

      await expect(service.addCargo(1, containerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('getCargo', () => {
    it('should return all cargo for a warehouse', async () => {
      const warehouse = { id: 1 } as Warehouse;
      const cargoList = [
        { id: 1, warehouseId: 1 },
        { id: 2, warehouseId: 1 },
      ] as Cargo[];

      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockCargoRepository.find.mockResolvedValue(cargoList);

      const result = await service.getCargo(1);

      expect(result).toEqual(cargoList);
      expect(mockCargoRepository.find).toHaveBeenCalledWith({
        where: { warehouseId: 1 },
      });
    });
  });

  describe('moveCargo', () => {
    const warehouse = {
      id: 1,
      x: 100,
      y: 100,
      z: 100,
    } as Warehouse;

    const cargo = {
      id: 1,
      warehouseId: 1,
      x: 0,
      y: 0,
      z: 0,
      sizeX: 10,
      sizeY: 10,
      sizeZ: 10,
      netWeight: 80,
      packWeight: 20,
      totalWeight: 100,
      maxLoadWeight: null,
    } as Cargo;

    const moveDto: MoveCargoDto = {
      x: 10,
      y: 10,
      z: 10,
    };

    beforeEach(() => {
      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockCargoRepository.findOne.mockResolvedValue(cargo);
    });

    it('should move cargo to new position', async () => {
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockCargoRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockCargoRepository.save.mockResolvedValue({
        ...cargo,
        ...moveDto,
      });

      const result = await service.moveCargo(1, 1, moveDto);

      expect(result.x).toBe(moveDto.x);
      expect(result.y).toBe(moveDto.y);
      expect(result.z).toBe(moveDto.z);
    });

    it('should throw NotFoundException if cargo not found', async () => {
      mockCargoRepository.findOne.mockResolvedValue(null);

      await expect(service.moveCargo(1, 999, moveDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateCargo', () => {
    const warehouse = {
      id: 1,
      x: 100,
      y: 100,
      z: 100,
    } as Warehouse;

    const cargo = {
      id: 1,
      warehouseId: 1,
      type: CargoType.CARGO,
      x: 0,
      y: 0,
      z: 0,
      sizeX: 10,
      sizeY: 10,
      sizeZ: 10,
    } as Cargo;

    beforeEach(() => {
      mockWarehouseRepository.findOne.mockResolvedValue(warehouse);
      mockCargoRepository.findOne.mockResolvedValue(cargo);
    });

    it('should update cargo', async () => {
      const updateDto: UpdateCargoDto = {
        name: 'Updated Name',
        netWeight: 150,
        packWeight: 50,
      };

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };

      mockCargoRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockCargoRepository.save.mockResolvedValue({
        ...cargo,
        ...updateDto,
        totalWeight: 200,
      });

      const result = await service.updateCargo(1, 1, updateDto);

      expect(result.name).toBe(updateDto.name);
      expect(result.netWeight).toBe(updateDto.netWeight);
      expect(result.packWeight).toBe(updateDto.packWeight);
    });

    it('should throw NotFoundException if cargo not found', async () => {
      mockCargoRepository.findOne.mockResolvedValue(null);

      await expect(
        service.updateCargo(1, 999, { name: 'Test' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeCargo', () => {
    it('should remove cargo', async () => {
      const cargo = { id: 1, warehouseId: 1 } as Cargo;

      mockCargoRepository.findOne.mockResolvedValue(cargo);
      mockCargoRepository.remove.mockResolvedValue(cargo);

      await service.removeCargo(1, 1);

      expect(mockCargoRepository.remove).toHaveBeenCalledWith(cargo);
    });

    it('should throw NotFoundException if cargo not found', async () => {
      mockCargoRepository.findOne.mockResolvedValue(null);

      await expect(service.removeCargo(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
