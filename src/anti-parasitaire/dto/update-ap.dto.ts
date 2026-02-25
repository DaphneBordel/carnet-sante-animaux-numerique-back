import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateAntiParaDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsString()
  nom: string;

  @IsString()
  qtité: string;

  @IsOptional()
  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
