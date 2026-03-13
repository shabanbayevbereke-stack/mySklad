import { Test, TestingModule } from '@nestjs/testing';
import { WarehouseController } from './warehouse.controller';
import { WarehouseService } from './warehouse.service';
import { Warehouse } from './warehouse.entity';
import { Cargo, CargoType } from './cargo.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { AddCargoDto } from './dto/add-cargo.dto';
import { MoveCargoDto } from './dto/move-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';

describe('WarehouseController', () => {
  let controller: WarehouseController;
  let service: WarehouseService;

  const mockWarehouse: Warehouse = {
    id: 1,
    x: 100,
    y: 100,
    z: 100,
    name: 'Test Warehouse',
    description: 'Test Description',
    cargo: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockCargo: Cargo = {
    id: 1,
    guid: 'test-guid-123',
    warehouseId: 1,
    type: CargoType.CARGO,
    name: 'Test Cargo',
    description: null,
    netWeight: 80,
    packWeight: 20,
    totalWeight: 100,
    maxLoadWeight: null,
    sizeX: 10,
    sizeY: 10,
    sizeZ: 10,
    containSizeX: null,
    containSizeY: null,
    containSizeZ: null,
    transportNumber: null,
    storageDate: new Date(),
    x: 0,
    y: 0,
    z: 0,
    warehouse: mockWarehouse,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockWarehouseService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findAllPaginated: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    addCargo: jest.fn(),
    getCargo: jest.fn(),
    getCargoPaginated: jest.fn(),
    moveCargo: jest.fn(),
    updateCargo: jest.fn(),
    removeCargo: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WarehouseController],
      providers: [
        {
          provide: WarehouseService,
          useValue: mockWarehouseService,
        },
      ],
    }).compile();

    controller = module.get<WarehouseController>(WarehouseController);
    service = module.get<WarehouseService>(WarehouseService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a warehouse', async () => {
      const createDto: CreateWarehouseDto = {
        x: 100,
        y: 100,
        z: 100,
        name: 'Test Warehouse',
        description: 'Test Description',
      };

      mockWarehouseService.create.mockResolvedValue(mockWarehouse);

      const result = await controller.create(createDto);

      expect(service.create).toHaveBeenCalledWith(createDto);
      expect(result).toEqual(mockWarehouse);
    });
  });

  describe('findAll', () => {
    it('should return an array of warehouses', async () => {
      const mockPaginatedResponse = {
        data: [mockWarehouse],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };
      mockWarehouseService.findAllPaginated.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.findAll({}, {});

      expect(service.findAllPaginated).toHaveBeenCalled();
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('findOne', () => {
    it('should return a warehouse by id', async () => {
      mockWarehouseService.findOne.mockResolvedValue(mockWarehouse);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockWarehouse);
    });
  });

  describe('update', () => {
    it('should update a warehouse', async () => {
      const updateDto: UpdateWarehouseDto = {
        name: 'Updated Warehouse',
      };

      const updatedWarehouse: Warehouse = {
        ...mockWarehouse,
        ...updateDto,
      };

      mockWarehouseService.update.mockResolvedValue(updatedWarehouse);

      const result = await controller.update(1, updateDto);

      expect(service.update).toHaveBeenCalledWith(1, updateDto);
      expect(result).toEqual(updatedWarehouse);
    });
  });

  describe('remove', () => {
    it('should remove a warehouse', async () => {
      mockWarehouseService.remove.mockResolvedValue(undefined);

      await controller.remove(1);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });

  describe('addCargo', () => {
    it('should add cargo to warehouse', async () => {
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

      mockWarehouseService.addCargo.mockResolvedValue(mockCargo);

      const result = await controller.addCargo(1, addCargoDto);

      expect(service.addCargo).toHaveBeenCalledWith(1, addCargoDto);
      expect(result).toEqual(mockCargo);
    });
  });

  describe('getCargo', () => {
    it('should return all cargo for a warehouse', async () => {
      const mockPaginatedResponse = {
        data: [mockCargo],
        meta: {
          page: 1,
          limit: 10,
          total: 1,
          totalPages: 1,
        },
      };
      mockWarehouseService.getCargoPaginated.mockResolvedValue(
        mockPaginatedResponse,
      );

      const result = await controller.getCargo(1, {}, {});

      expect(service.getCargoPaginated).toHaveBeenCalledWith(1, {}, {});
      expect(result).toEqual(mockPaginatedResponse);
    });
  });

  describe('moveCargo', () => {
    it('should move cargo to new position', async () => {
      const moveDto: MoveCargoDto = {
        x: 10,
        y: 10,
        z: 10,
      };

      const movedCargo: Cargo = {
        ...mockCargo,
        ...moveDto,
      };

      mockWarehouseService.moveCargo.mockResolvedValue(movedCargo);

      const result = await controller.moveCargo(1, 1, moveDto);

      expect(service.moveCargo).toHaveBeenCalledWith(1, 1, moveDto);
      expect(result).toEqual(movedCargo);
    });
  });

  describe('updateCargo', () => {
    it('should update cargo', async () => {
      const updateDto: UpdateCargoDto = {
        name: 'Updated Cargo',
        netWeight: 150,
        packWeight: 50,
      };

      const updatedCargo: Cargo = {
        ...mockCargo,
        ...updateDto,
      };

      mockWarehouseService.updateCargo.mockResolvedValue(updatedCargo);

      const result = await controller.updateCargo(1, 1, updateDto);

      expect(service.updateCargo).toHaveBeenCalledWith(1, 1, updateDto);
      expect(result).toEqual(updatedCargo);
    });
  });

  describe('removeCargo', () => {
    it('should remove cargo from warehouse', async () => {
      mockWarehouseService.removeCargo.mockResolvedValue(undefined);

      await controller.removeCargo(1, 1);

      expect(service.removeCargo).toHaveBeenCalledWith(1, 1);
    });
  });
});
