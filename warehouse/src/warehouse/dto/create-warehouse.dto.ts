import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class CreateWarehouseDto {
  @IsNumber()
  @Min(1)
  x: number;

  @IsNumber()
  @Min(1)
  y: number;

  @IsNumber()
  @Min(1)
  z: number;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
