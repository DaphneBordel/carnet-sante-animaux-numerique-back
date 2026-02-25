import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateMedicamentDto {
  @IsString()
  nom: string;

  @IsString()
  posologie: string;

  @Type(() => Date)
@IsDate()
  dateDebut: Date;

  @Type(() => Date)
@IsDate()
  dateFin: Date;
}

export class CreateTraitementDto {
  listeMedicaments: CreateMedicamentDto[];

  @IsInt()
  animalId: number;
}
