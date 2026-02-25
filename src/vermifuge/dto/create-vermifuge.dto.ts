import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateVermifugeDto {
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
