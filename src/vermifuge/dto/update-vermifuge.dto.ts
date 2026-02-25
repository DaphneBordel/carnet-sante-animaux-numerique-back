import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateVermifugeDto {
  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  nom?: string;

  @IsOptional()
  @IsString()
  qtite?: string;

  @IsOptional()
  @IsDateString()
  dateRappel?: string;

  animalId: number;
}
