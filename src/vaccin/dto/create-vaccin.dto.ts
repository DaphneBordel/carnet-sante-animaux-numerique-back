import { IsDateString, IsString } from 'class-validator';

export class CreateVaccinDto {
  @Type(() => Date)
@IsDate()
  date?: Date;

  @IsString()
  nom: string;

  @Type(() => Date)
@IsDate()
  dateRappel?: Date;

  animalId: number;
}
