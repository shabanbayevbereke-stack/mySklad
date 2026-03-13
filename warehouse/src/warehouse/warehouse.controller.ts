import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { WarehouseService } from './warehouse.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { AddCargoDto } from './dto/add-cargo.dto';
import { MoveCargoDto } from './dto/move-cargo.dto';
import { UpdateCargoDto } from './dto/update-cargo.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { WarehouseFilterDto } from './dto/warehouse-filter.dto';
import { CargoFilterDto } from './dto/cargo-filter.dto';

@Controller('warehouse')
export class WarehouseController {
  constructor(private readonly warehouseService: WarehouseService) {}

  @Post()
  create(@Body() createWarehouseDto: CreateWarehouseDto) {
    return this.warehouseService.create(createWarehouseDto);
  }

  @Get()
  findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filterDto: WarehouseFilterDto,
  ) {
    return this.warehouseService.findAllPaginated(paginationQuery, filterDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    return this.warehouseService.update(id, updateWarehouseDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.warehouseService.remove(id);
  }

  @Post(':id/cargo')
  addCargo(
    @Param('id', ParseIntPipe) id: number,
    @Body() addCargoDto: AddCargoDto,
  ) {
    return this.warehouseService.addCargo(id, addCargoDto);
  }

  @Get(':id/cargo')
  getCargo(
    @Param('id', ParseIntPipe) id: number,
    @Query() paginationQuery: PaginationQueryDto,
    @Query() filterDto: CargoFilterDto,
  ) {
    return this.warehouseService.getCargoPaginated(
      id,
      paginationQuery,
      filterDto,
    );
  }

  @Patch(':id/cargo/:cargoId')
  moveCargo(
    @Param('id', ParseIntPipe) id: number,
    @Param('cargoId', ParseIntPipe) cargoId: number,
    @Body() moveCargoDto: MoveCargoDto,
  ) {
    return this.warehouseService.moveCargo(id, cargoId, moveCargoDto);
  }

  @Put(':id/cargo/:cargoId')
  updateCargo(
    @Param('id', ParseIntPipe) id: number,
    @Param('cargoId', ParseIntPipe) cargoId: number,
    @Body() updateCargoDto: UpdateCargoDto,
  ) {
    return this.warehouseService.updateCargo(id, cargoId, updateCargoDto);
  }

  @Delete(':id/cargo/:cargoId')
  removeCargo(
    @Param('id', ParseIntPipe) id: number,
    @Param('cargoId', ParseIntPipe) cargoId: number,
  ) {
    return this.warehouseService.removeCargo(id, cargoId);
  }
}
