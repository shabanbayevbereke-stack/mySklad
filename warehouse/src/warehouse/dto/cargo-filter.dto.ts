import {
  IsOptional,
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CargoType } from '../cargo.entity';

export class CargoFilterDto {
  @IsOptional()
  @IsString()
  guid?: string;

  @IsOptional()
  @IsEnum(CargoType)
  type?: CargoType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  netWeightMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  netWeightMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  packWeightMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  packWeightMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalWeightMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  totalWeightMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxLoadWeightMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxLoadWeightMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeXMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeXMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeYMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeYMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeZMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  sizeZMax?: number;

  @IsOptional()
  @IsString()
  transportNumber?: string;

  @IsOptional()
  @IsDateString()
  storageDateFrom?: string;

  @IsOptional()
  @IsDateString()
  storageDateTo?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  xMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  xMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  yMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  zMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  zMax?: number;

  @IsOptional()
  @IsDateString()
  createdAtFrom?: string;

  @IsOptional()
  @IsDateString()
  createdAtTo?: string;

  @IsOptional()
  @IsDateString()
  updatedAtFrom?: string;

  @IsOptional()
  @IsDateString()
  updatedAtTo?: string;
}
