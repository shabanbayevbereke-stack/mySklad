import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { Cargo, CargoType } from './cargo.entity';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { AddCargoDto } from './dto/add-cargo.dto';
import { MoveCargoDto } from './dto/move-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponse } from '../common/interfaces/paginated-response.interface';
import { WarehouseFilterDto } from './dto/warehouse-filter.dto';
import { CargoFilterDto } from './dto/cargo-filter.dto';

@Injectable()
export class WarehouseService {
  constructor(
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
    @InjectRepository(Cargo)
    private cargoRepository: Repository<Cargo>,
  ) {}

  async create(createWarehouseDto: CreateWarehouseDto): Promise<Warehouse> {
    const warehouse = this.warehouseRepository.create(createWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async findAll(): Promise<Warehouse[]> {
    return this.warehouseRepository.find({
      relations: ['cargo'],
    });
  }

  async findAllPaginated(
    paginationQuery: PaginationQueryDto,
    filterDto?: WarehouseFilterDto,
  ): Promise<PaginatedResponse<Warehouse>> {
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.warehouseRepository
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.cargo', 'cargo');

    // Apply filters
    if (filterDto) {
      if (filterDto.name) {
        queryBuilder.andWhere('warehouse.name LIKE :name', {
          name: `%${filterDto.name}%`,
        });
      }
      if (filterDto.description) {
        queryBuilder.andWhere('warehouse.description LIKE :description', {
          description: `%${filterDto.description}%`,
        });
      }
      if (filterDto.xMin !== undefined) {
        queryBuilder.andWhere('warehouse.x >= :xMin', { xMin: filterDto.xMin });
      }
      if (filterDto.xMax !== undefined) {
        queryBuilder.andWhere('warehouse.x <= :xMax', { xMax: filterDto.xMax });
      }
      if (filterDto.yMin !== undefined) {
        queryBuilder.andWhere('warehouse.y >= :yMin', { yMin: filterDto.yMin });
      }
      if (filterDto.yMax !== undefined) {
        queryBuilder.andWhere('warehouse.y <= :yMax', { yMax: filterDto.yMax });
      }
      if (filterDto.zMin !== undefined) {
        queryBuilder.andWhere('warehouse.z >= :zMin', { zMin: filterDto.zMin });
      }
      if (filterDto.zMax !== undefined) {
        queryBuilder.andWhere('warehouse.z <= :zMax', { zMax: filterDto.zMax });
      }
      if (filterDto.createdAtFrom) {
        queryBuilder.andWhere('warehouse.createdAt >= :createdAtFrom', {
          createdAtFrom: filterDto.createdAtFrom,
        });
      }
      if (filterDto.createdAtTo) {
        queryBuilder.andWhere('warehouse.createdAt <= :createdAtTo', {
          createdAtTo: filterDto.createdAtTo,
        });
      }
      if (filterDto.updatedAtFrom) {
        queryBuilder.andWhere('warehouse.updatedAt >= :updatedAtFrom', {
          updatedAtFrom: filterDto.updatedAtFrom,
        });
      }
      if (filterDto.updatedAtTo) {
        queryBuilder.andWhere('warehouse.updatedAt <= :updatedAtTo', {
          updatedAtTo: filterDto.updatedAtTo,
        });
      }
    }

    queryBuilder.orderBy('warehouse.id', 'ASC');
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

  async findOne(id: number): Promise<Warehouse> {
    const warehouse = await this.warehouseRepository.findOne({
      where: { id },
      relations: ['cargo'],
    });
    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }
    return warehouse;
  }

  async update(
    id: number,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouse = await this.findOne(id);
    Object.assign(warehouse, updateWarehouseDto);
    return this.warehouseRepository.save(warehouse);
  }

  async remove(id: number): Promise<void> {
    const warehouse = await this.findOne(id);

    // Check if warehouse has any cargo
    const cargoCount = await this.cargoRepository.count({
      where: { warehouseId: id },
    });

    if (cargoCount > 0) {
      throw new BadRequestException(
        'Cannot delete warehouse that contains cargo. Please remove all cargo first.',
      );
    }

    await this.warehouseRepository.remove(warehouse);
  }

  private async validateFreeCoordinates(
    warehouseId: number,
    x: number,
    y: number,
    z: number,
    sizeX: number,
    sizeY: number,
    sizeZ: number,
    excludeCargoId?: number,
    totalWeight?: number,
  ): Promise<void> {
    // Check if coordinates are within warehouse bounds
    const warehouse = await this.findOne(warehouseId);

    if (x < 0 || y < 0 || z < 0) {
      throw new BadRequestException('Cargo coordinates cannot be negative');
    }

    if (
      x + sizeX > warehouse.x ||
      y + sizeY > warehouse.y ||
      z + sizeZ > warehouse.z
    ) {
      throw new BadRequestException(
        'Cargo does not fit in warehouse at specified coordinates',
      );
    }

    // Check for overlapping cargo
    const queryBuilder = this.cargoRepository
      .createQueryBuilder('cargo')
      .where('cargo.warehouseId = :warehouseId', { warehouseId })
      .andWhere(
        'NOT (cargo.x + cargo.sizeX <= :x OR :x + :sizeX <= cargo.x OR cargo.y + cargo.sizeY <= :y OR :y + :sizeY <= cargo.y OR cargo.z + cargo.sizeZ <= :z OR :z + :sizeZ <= cargo.z)',
        {
          x,
          y,
          z,
          sizeX,
          sizeY,
          sizeZ,
        },
      );

    if (excludeCargoId !== undefined) {
      queryBuilder.andWhere('cargo.id != :excludeCargoId', {
        excludeCargoId,
      });
    }

    const overlappingCargo = await queryBuilder.getOne();

    if (overlappingCargo) {
      throw new ConflictException(
        `Coordinates (${x}, ${y}, ${z}) with size (${sizeX}, ${sizeY}, ${sizeZ}) are already occupied by another cargo`,
      );
    }

    // Check if placing cargo at y+1 (on top of another cargo)
    // Find cargoes that are directly below this position
    if (y > 0 && totalWeight !== undefined) {
      const cargoesBelow = await this.cargoRepository
        .createQueryBuilder('cargo')
        .where('cargo.warehouseId = :warehouseId', { warehouseId })
        .andWhere('cargo.y + cargo.sizeY = :y', { y })
        .andWhere(
          'NOT (cargo.x + cargo.sizeX <= :x OR :x + :sizeX <= cargo.x OR cargo.z + cargo.sizeZ <= :z OR :z + :sizeZ <= cargo.z)',
          {
            x,
            z,
            sizeX,
            sizeZ,
          },
        )
        .getMany();

      if (cargoesBelow.length > 0) {
        // Check if any cargo below can support the weight
        for (const cargoBelow of cargoesBelow) {
          if (cargoBelow.maxLoadWeight === null) {
            throw new BadRequestException(
              `Cargo at (${cargoBelow.x}, ${cargoBelow.y}, ${cargoBelow.z}) cannot support weight (maxLoadWeight is not set)`,
            );
          }
          if (Number(totalWeight) > Number(cargoBelow.maxLoadWeight)) {
            throw new BadRequestException(
              `Cargo at (${cargoBelow.x}, ${cargoBelow.y}, ${cargoBelow.z}) cannot support weight ${totalWeight} (maxLoadWeight: ${cargoBelow.maxLoadWeight})`,
            );
          }
        }
      }
    }
  }

  private validateContainerSizes(cargo: AddCargoDto | UpdateCargoDto): void {
    if (cargo.type === CargoType.CONTAINER) {
      if (!cargo.containSizeX || !cargo.containSizeY || !cargo.containSizeZ) {
        throw new BadRequestException(
          'Container sizes (containSizeX, containSizeY, containSizeZ) are required for container type',
        );
      }

      const sizeX = 'sizeX' in cargo ? cargo.sizeX : undefined;
      const sizeY = 'sizeY' in cargo ? cargo.sizeY : undefined;
      const sizeZ = 'sizeZ' in cargo ? cargo.sizeZ : undefined;

      if (
        sizeX &&
        sizeY &&
        sizeZ &&
        (cargo.containSizeX < sizeX ||
          cargo.containSizeY < sizeY ||
          cargo.containSizeZ < sizeZ)
      ) {
        throw new BadRequestException(
          'Container sizes must be greater than or equal to cargo sizes',
        );
      }
    }
  }

  async addCargo(
    warehouseId: number,
    addCargoDto: AddCargoDto,
  ): Promise<Cargo> {
    // Check if guid already exists in this warehouse
    const existingCargo = await this.cargoRepository.findOne({
      where: { warehouseId, guid: addCargoDto.guid },
    });
    if (existingCargo) {
      throw new ConflictException(
        `Cargo with GUID ${addCargoDto.guid} already exists in this warehouse`,
      );
    }

    // Validate container sizes
    this.validateContainerSizes(addCargoDto);

    // Calculate totalWeight
    const totalWeight: number =
      Number(addCargoDto.netWeight) + Number(addCargoDto.packWeight);

    // Validate free coordinates (x, y, z) and check for overlaps
    await this.validateFreeCoordinates(
      warehouseId,
      addCargoDto.x,
      addCargoDto.y,
      addCargoDto.z,
      addCargoDto.sizeX,
      addCargoDto.sizeY,
      addCargoDto.sizeZ,
      undefined,
      totalWeight,
    );

    const cargo = this.cargoRepository.create({
      ...addCargoDto,
      warehouseId,
      totalWeight: totalWeight,
      storageDate: addCargoDto.storageDate
        ? new Date(addCargoDto.storageDate)
        : new Date(),
      containSizeX:
        addCargoDto.type === CargoType.CONTAINER
          ? addCargoDto.containSizeX
          : null,
      containSizeY:
        addCargoDto.type === CargoType.CONTAINER
          ? addCargoDto.containSizeY
          : null,
      containSizeZ:
        addCargoDto.type === CargoType.CONTAINER
          ? addCargoDto.containSizeZ
          : null,
    });

    return this.cargoRepository.save(cargo);
  }

  async getCargo(warehouseId: number): Promise<Cargo[]> {
    await this.findOne(warehouseId); // Verify warehouse exists
    return this.cargoRepository.find({
      where: { warehouseId },
    });
  }

  async getCargoPaginated(
    warehouseId: number,
    paginationQuery: PaginationQueryDto,
    filterDto?: CargoFilterDto,
  ): Promise<PaginatedResponse<Cargo>> {
    await this.findOne(warehouseId); // Verify warehouse exists
    const { page = 1, limit = 10 } = paginationQuery;
    const skip = (page - 1) * limit;

    const queryBuilder = this.cargoRepository
      .createQueryBuilder('cargo')
      .where('cargo.warehouseId = :warehouseId', { warehouseId });

    // Apply filters
    if (filterDto) {
      if (filterDto.guid) {
        queryBuilder.andWhere('cargo.guid LIKE :guid', {
          guid: `%${filterDto.guid}%`,
        });
      }
      if (filterDto.type !== undefined) {
        queryBuilder.andWhere('cargo.type = :type', { type: filterDto.type });
      }
      if (filterDto.name) {
        queryBuilder.andWhere('cargo.name LIKE :name', {
          name: `%${filterDto.name}%`,
        });
      }
      if (filterDto.description) {
        queryBuilder.andWhere('cargo.description LIKE :description', {
          description: `%${filterDto.description}%`,
        });
      }
      if (filterDto.netWeightMin !== undefined) {
        queryBuilder.andWhere('cargo.netWeight >= :netWeightMin', {
          netWeightMin: filterDto.netWeightMin,
        });
      }
      if (filterDto.netWeightMax !== undefined) {
        queryBuilder.andWhere('cargo.netWeight <= :netWeightMax', {
          netWeightMax: filterDto.netWeightMax,
        });
      }
      if (filterDto.packWeightMin !== undefined) {
        queryBuilder.andWhere('cargo.packWeight >= :packWeightMin', {
          packWeightMin: filterDto.packWeightMin,
        });
      }
      if (filterDto.packWeightMax !== undefined) {
        queryBuilder.andWhere('cargo.packWeight <= :packWeightMax', {
          packWeightMax: filterDto.packWeightMax,
        });
      }
      if (filterDto.totalWeightMin !== undefined) {
        queryBuilder.andWhere('cargo.totalWeight >= :totalWeightMin', {
          totalWeightMin: filterDto.totalWeightMin,
        });
      }
      if (filterDto.totalWeightMax !== undefined) {
        queryBuilder.andWhere('cargo.totalWeight <= :totalWeightMax', {
          totalWeightMax: filterDto.totalWeightMax,
        });
      }
      if (filterDto.maxLoadWeightMin !== undefined) {
        queryBuilder.andWhere('cargo.maxLoadWeight >= :maxLoadWeightMin', {
          maxLoadWeightMin: filterDto.maxLoadWeightMin,
        });
      }
      if (filterDto.maxLoadWeightMax !== undefined) {
        queryBuilder.andWhere('cargo.maxLoadWeight <= :maxLoadWeightMax', {
          maxLoadWeightMax: filterDto.maxLoadWeightMax,
        });
      }
      if (filterDto.sizeXMin !== undefined) {
        queryBuilder.andWhere('cargo.sizeX >= :sizeXMin', {
          sizeXMin: filterDto.sizeXMin,
        });
      }
      if (filterDto.sizeXMax !== undefined) {
        queryBuilder.andWhere('cargo.sizeX <= :sizeXMax', {
          sizeXMax: filterDto.sizeXMax,
        });
      }
      if (filterDto.sizeYMin !== undefined) {
        queryBuilder.andWhere('cargo.sizeY >= :sizeYMin', {
          sizeYMin: filterDto.sizeYMin,
        });
      }
      if (filterDto.sizeYMax !== undefined) {
        queryBuilder.andWhere('cargo.sizeY <= :sizeYMax', {
          sizeYMax: filterDto.sizeYMax,
        });
      }
      if (filterDto.sizeZMin !== undefined) {
        queryBuilder.andWhere('cargo.sizeZ >= :sizeZMin', {
          sizeZMin: filterDto.sizeZMin,
        });
      }
      if (filterDto.sizeZMax !== undefined) {
        queryBuilder.andWhere('cargo.sizeZ <= :sizeZMax', {
          sizeZMax: filterDto.sizeZMax,
        });
      }
      if (filterDto.transportNumber) {
        queryBuilder.andWhere('cargo.transportNumber LIKE :transportNumber', {
          transportNumber: `%${filterDto.transportNumber}%`,
        });
      }
      if (filterDto.storageDateFrom) {
        queryBuilder.andWhere('cargo.storageDate >= :storageDateFrom', {
          storageDateFrom: filterDto.storageDateFrom,
        });
      }
      if (filterDto.storageDateTo) {
        queryBuilder.andWhere('cargo.storageDate <= :storageDateTo', {
          storageDateTo: filterDto.storageDateTo,
        });
      }
      if (filterDto.xMin !== undefined) {
        queryBuilder.andWhere('cargo.x >= :xMin', { xMin: filterDto.xMin });
      }
      if (filterDto.xMax !== undefined) {
        queryBuilder.andWhere('cargo.x <= :xMax', { xMax: filterDto.xMax });
      }
      if (filterDto.yMin !== undefined) {
        queryBuilder.andWhere('cargo.y >= :yMin', { yMin: filterDto.yMin });
      }
      if (filterDto.yMax !== undefined) {
        queryBuilder.andWhere('cargo.y <= :yMax', { yMax: filterDto.yMax });
      }
      if (filterDto.zMin !== undefined) {
        queryBuilder.andWhere('cargo.z >= :zMin', { zMin: filterDto.zMin });
      }
      if (filterDto.zMax !== undefined) {
        queryBuilder.andWhere('cargo.z <= :zMax', { zMax: filterDto.zMax });
      }
      if (filterDto.createdAtFrom) {
        queryBuilder.andWhere('cargo.createdAt >= :createdAtFrom', {
          createdAtFrom: filterDto.createdAtFrom,
        });
      }
      if (filterDto.createdAtTo) {
        queryBuilder.andWhere('cargo.createdAt <= :createdAtTo', {
          createdAtTo: filterDto.createdAtTo,
        });
      }
      if (filterDto.updatedAtFrom) {
        queryBuilder.andWhere('cargo.updatedAt >= :updatedAtFrom', {
          updatedAtFrom: filterDto.updatedAtFrom,
        });
      }
      if (filterDto.updatedAtTo) {
        queryBuilder.andWhere('cargo.updatedAt <= :updatedAtTo', {
          updatedAtTo: filterDto.updatedAtTo,
        });
      }
    }

    queryBuilder.orderBy('cargo.id', 'ASC');
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

  async moveCargo(
    warehouseId: number,
    cargoId: number,
    moveCargoDto: MoveCargoDto,
  ): Promise<Cargo> {
    const cargo = await this.cargoRepository.findOne({
      where: { id: cargoId, warehouseId },
    });

    if (!cargo) {
      throw new NotFoundException(
        `Cargo with ID ${cargoId} not found in warehouse ${warehouseId}`,
      );
    }

    // Validate free coordinates (x, y, z) for new position
    await this.validateFreeCoordinates(
      warehouseId,
      moveCargoDto.x,
      moveCargoDto.y,
      moveCargoDto.z,
      cargo.sizeX,
      cargo.sizeY,
      cargo.sizeZ,
      cargoId,
      cargo.totalWeight,
    );

    cargo.x = moveCargoDto.x;
    cargo.y = moveCargoDto.y;
    cargo.z = moveCargoDto.z;

    return this.cargoRepository.save(cargo);
  }

  async updateCargo(
    warehouseId: number,
    cargoId: number,
    updateCargoDto: UpdateCargoDto,
  ): Promise<Cargo> {
    const cargo = await this.cargoRepository.findOne({
      where: { id: cargoId, warehouseId },
    });

    if (!cargo) {
      throw new NotFoundException(
        `Cargo with ID ${cargoId} not found in warehouse ${warehouseId}`,
      );
    }

    // If type is being changed or container sizes are being updated
    const newType = updateCargoDto.type ?? cargo.type;
    if (newType === CargoType.CONTAINER) {
      this.validateContainerSizes({
        type: newType,
        sizeX: updateCargoDto.sizeX ?? cargo.sizeX,
        sizeY: updateCargoDto.sizeY ?? cargo.sizeY,
        sizeZ: updateCargoDto.sizeZ ?? cargo.sizeZ,
        containSizeX:
          updateCargoDto.containSizeX ?? cargo.containSizeX ?? undefined,
        containSizeY:
          updateCargoDto.containSizeY ?? cargo.containSizeY ?? undefined,
        containSizeZ:
          updateCargoDto.containSizeZ ?? cargo.containSizeZ ?? undefined,
      });
    }

    // Calculate new totalWeight if netWeight or packWeight are being updated
    const newNetWeight = Number(updateCargoDto.netWeight ?? cargo.netWeight);
    const newPackWeight = Number(updateCargoDto.packWeight ?? cargo.packWeight);
    const newTotalWeight = newNetWeight + newPackWeight;

    // If sizes are being updated, validate free coordinates
    if (updateCargoDto.sizeX || updateCargoDto.sizeY || updateCargoDto.sizeZ) {
      const newSizeX = updateCargoDto.sizeX ?? cargo.sizeX;
      const newSizeY = updateCargoDto.sizeY ?? cargo.sizeY;
      const newSizeZ = updateCargoDto.sizeZ ?? cargo.sizeZ;

      await this.validateFreeCoordinates(
        warehouseId,
        cargo.x,
        cargo.y,
        cargo.z,
        newSizeX,
        newSizeY,
        newSizeZ,
        cargoId,
        newTotalWeight,
      );
    }

    // If weight is being updated, validate for cargoes on top
    if (
      updateCargoDto.netWeight !== undefined ||
      updateCargoDto.packWeight !== undefined
    ) {
      // Check if there are cargoes on top of this one
      const cargoesOnTop = await this.cargoRepository
        .createQueryBuilder('cargo')
        .where('cargo.warehouseId = :warehouseId', { warehouseId })
        .andWhere('cargo.y = :y', { y: cargo.y + cargo.sizeY })
        .andWhere(
          'NOT (cargo.x + cargo.sizeX <= :x OR :x + :sizeX <= cargo.x OR cargo.z + cargo.sizeZ <= :z OR :z + :sizeZ <= cargo.z)',
          {
            x: cargo.x,
            z: cargo.z,
            sizeX: cargo.sizeX,
            sizeZ: cargo.sizeZ,
          },
        )
        .getMany();

      if (cargoesOnTop.length > 0) {
        const totalWeightOnTop: number = cargoesOnTop.reduce(
          (sum, c) => sum + Number(c.totalWeight),
          0,
        );
        const cargoMaxLoadWeightValue = cargo.maxLoadWeight;
        const cargoMaxLoadWeight: number | null =
          cargoMaxLoadWeightValue != null
            ? typeof cargoMaxLoadWeightValue === 'number'
              ? cargoMaxLoadWeightValue
              : parseFloat(String(cargoMaxLoadWeightValue))
            : null;
        const newMaxLoadWeight: number | null =
          updateCargoDto.maxLoadWeight !== undefined
            ? Number(updateCargoDto.maxLoadWeight)
            : cargoMaxLoadWeight;
        if (newMaxLoadWeight === null) {
          throw new BadRequestException(
            'Cannot update weight: cargo has cargoes on top but maxLoadWeight is not set',
          );
        }
        if (totalWeightOnTop > newMaxLoadWeight) {
          throw new BadRequestException(
            `Cannot update weight: cargoes on top have total weight ${totalWeightOnTop} which exceeds maxLoadWeight ${newMaxLoadWeight}`,
          );
        }
      }
    }

    // Update fields
    if (updateCargoDto.type !== undefined) {
      cargo.type = updateCargoDto.type;
      if (updateCargoDto.type === CargoType.CARGO) {
        cargo.containSizeX = null;
        cargo.containSizeY = null;
        cargo.containSizeZ = null;
      }
    }

    if (updateCargoDto.name !== undefined) cargo.name = updateCargoDto.name;
    if (updateCargoDto.description !== undefined)
      cargo.description = updateCargoDto.description;
    if (updateCargoDto.netWeight !== undefined)
      cargo.netWeight = Number(updateCargoDto.netWeight);
    if (updateCargoDto.packWeight !== undefined)
      cargo.packWeight = Number(updateCargoDto.packWeight);
    if (updateCargoDto.maxLoadWeight !== undefined)
      cargo.maxLoadWeight =
        updateCargoDto.maxLoadWeight !== null
          ? Number(updateCargoDto.maxLoadWeight)
          : null;
    cargo.totalWeight = newTotalWeight;
    if (updateCargoDto.sizeX !== undefined) cargo.sizeX = updateCargoDto.sizeX;
    if (updateCargoDto.sizeY !== undefined) cargo.sizeY = updateCargoDto.sizeY;
    if (updateCargoDto.sizeZ !== undefined) cargo.sizeZ = updateCargoDto.sizeZ;
    if (updateCargoDto.containSizeX !== undefined)
      cargo.containSizeX = updateCargoDto.containSizeX;
    if (updateCargoDto.containSizeY !== undefined)
      cargo.containSizeY = updateCargoDto.containSizeY;
    if (updateCargoDto.containSizeZ !== undefined)
      cargo.containSizeZ = updateCargoDto.containSizeZ;
    if (updateCargoDto.transportNumber !== undefined)
      cargo.transportNumber = updateCargoDto.transportNumber;

    return this.cargoRepository.save(cargo);
  }

  async removeCargo(warehouseId: number, cargoId: number): Promise<void> {
    const cargo = await this.cargoRepository.findOne({
      where: { id: cargoId, warehouseId },
    });

    if (!cargo) {
      throw new NotFoundException(
        `Cargo with ID ${cargoId} not found in warehouse ${warehouseId}`,
      );
    }

    await this.cargoRepository.remove(cargo);
  }
}
