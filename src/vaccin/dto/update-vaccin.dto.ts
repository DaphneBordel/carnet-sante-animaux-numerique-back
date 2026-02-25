import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateVaccinDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
