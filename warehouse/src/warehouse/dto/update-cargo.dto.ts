import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  ValidateIf,
} from 'class-validator';
import { CargoType } from '../cargo.entity';

export class UpdateCargoDto {
  @IsOptional()
  @IsEnum(CargoType)
  type?: CargoType;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsNumber()
  @Min(0)
  netWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  packWeight?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLoadWeight?: number | null;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sizeX?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sizeY?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  sizeZ?: number;

  @ValidateIf((o: UpdateCargoDto) => o.type === CargoType.CONTAINER)
  @IsOptional()
  @IsNumber()
  @Min(1)
  containSizeX?: number;

  @ValidateIf((o: UpdateCargoDto) => o.type === CargoType.CONTAINER)
  @IsOptional()
  @IsNumber()
  @Min(1)
  containSizeY?: number;

  @ValidateIf((o: UpdateCargoDto) => o.type === CargoType.CONTAINER)
  @IsOptional()
  @IsNumber()
  @Min(1)
  containSizeZ?: number;

  @IsOptional()
  @IsString()
  transportNumber?: string | null;
}
