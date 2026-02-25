import { IsDateString, IsString } from 'class-validator';

export class CreateVermifugeDto {
  @IsDateString()
  date?: string;

  @IsString()
  nom: string;

  @IsString()
  qtité: string;

  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
