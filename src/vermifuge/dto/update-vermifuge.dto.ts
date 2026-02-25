import { IsDateString, IsString } from 'class-validator';

export class UpdateVermifugeDto {
  @IsDateString()
  date?: string;

  @IsString()
  nom?: string;

  @IsString()
  qtité?: string;

  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
