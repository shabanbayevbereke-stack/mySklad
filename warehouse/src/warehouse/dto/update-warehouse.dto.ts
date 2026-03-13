import { IsNumber, IsString, IsOptional, Min } from 'class-validator';

export class UpdateWarehouseDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  x?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  y?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  z?: number;

  @IsOptional()
  @IsString()
  name?: string | null;

  @IsOptional()
  @IsString()
  description?: string | null;
}
