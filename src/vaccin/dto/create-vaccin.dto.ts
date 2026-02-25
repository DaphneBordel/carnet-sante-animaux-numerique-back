import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVaccinDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  nom: string;

  @IsOptional()
  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
