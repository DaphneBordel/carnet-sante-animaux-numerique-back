import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateAntiParaDto {
  @IsDateString()
  date: Date;

  @IsString()
  nom: string;

  @Type(() => Number) // 🔥 obligatoire
  @IsNumber({ maxDecimalPlaces: 2 })
  qtité: number;

  animalId: number;
}
