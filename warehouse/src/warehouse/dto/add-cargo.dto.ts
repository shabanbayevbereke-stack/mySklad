import {
  IsEnum,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
  ValidateIf,
} from 'class-validator';
import { CargoType } from '../cargo.entity';

export class AddCargoDto {
  @IsEnum(CargoType)
  type: CargoType;

  @IsString()
  guid: string;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsNumber()
  @Min(0)
  netWeight: number;

  @IsNumber()
  @Min(0)
  packWeight: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxLoadWeight?: number | null;

  @IsNumber()
  @Min(1)
  sizeX: number;

  @IsNumber()
  @Min(1)
  sizeY: number;

  @IsNumber()
  @Min(1)
  sizeZ: number;

  @ValidateIf((o: AddCargoDto) => o.type === CargoType.CONTAINER)
  @IsNumber()
  @Min(1)
  containSizeX?: number;

  @ValidateIf((o: AddCargoDto) => o.type === CargoType.CONTAINER)
  @IsNumber()
  @Min(1)
  containSizeY?: number;

  @ValidateIf((o: AddCargoDto) => o.type === CargoType.CONTAINER)
  @IsNumber()
  @Min(1)
  containSizeZ?: number;

  @IsOptional()
  @IsString()
  transportNumber?: string | null;

  @IsOptional()
  @IsDateString()
  storageDate?: string;

  @IsNumber()
  @Min(0)
  x: number;

  @IsNumber()
  @Min(0)
  y: number;

  @IsNumber()
  @Min(0)
  z: number;
}
