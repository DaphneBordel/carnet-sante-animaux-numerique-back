import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVermifugeDto {
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
