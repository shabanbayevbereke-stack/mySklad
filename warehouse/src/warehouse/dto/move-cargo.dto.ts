import { IsNumber, Min } from 'class-validator';

export class MoveCargoDto {
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
