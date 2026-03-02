import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class CreatePoidsDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  kilo: number;
  animalId: number;
}
