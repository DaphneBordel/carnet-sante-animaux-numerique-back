import { IsDateString, IsString } from 'class-validator';

export class CreateVaccinDto {
  @IsDateString()
  date?: Date;

  @IsString()
  nom: string;

  @IsDateString()
  dateRappel?: Date;

  animalId: number;
}
