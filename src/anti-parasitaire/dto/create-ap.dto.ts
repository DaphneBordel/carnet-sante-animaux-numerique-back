import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateAntiParaDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  nom: string;

  @IsString()
  qtite: string;

  @IsOptional()
  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
