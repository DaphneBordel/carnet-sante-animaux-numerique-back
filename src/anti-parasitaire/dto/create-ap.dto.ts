import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class CreateAntiParaDto {
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsString()
  nom: string;

  @IsString()
  qtité: string;

  @Type(() => Date)
  @IsDate()
  dateRappel?: Date;

  animalId: number;
}
