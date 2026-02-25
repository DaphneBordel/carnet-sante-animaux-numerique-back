import { IsDateString, IsString } from 'class-validator';

export class CreateAntiParaDto {
  @IsDateString()
  date?: Date;

  @IsString()
  nom: string;

  @IsString()
  qtité: string;

  @IsDateString()
  dateRappel?: Date;

  animalId: number;
}
