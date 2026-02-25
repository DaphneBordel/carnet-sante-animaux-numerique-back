import { IsDateString, IsString } from 'class-validator';

export class CreateVaccinDto {
  @IsDateString()
  date?: string;

  @IsString()
  nom: string;

  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
