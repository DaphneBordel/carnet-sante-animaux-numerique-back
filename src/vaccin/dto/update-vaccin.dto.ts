import { Type } from 'class-transformer';
import { IsDate, IsString } from 'class-validator';

export class UpdateVaccinDto {
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsString()
  nom?: string;

  @Type(() => Date)
  @IsDate()
  dateRappel?: Date;

  animalId: number;
}
