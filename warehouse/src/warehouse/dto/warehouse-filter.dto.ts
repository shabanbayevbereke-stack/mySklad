import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class WarehouseFilterDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

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

