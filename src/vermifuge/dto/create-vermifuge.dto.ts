import { IsDateString, IsString } from 'class-validator';

export class CreateVermifugeDto {
  @IsDateString()
  date?: Date;

  @IsString()
  nom: string;

  @IsString()
  qtité: string;

  @IsDateString()
  dateRappel?: Date;

  animalId: number;
}
