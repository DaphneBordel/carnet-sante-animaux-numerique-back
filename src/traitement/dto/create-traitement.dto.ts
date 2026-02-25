import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateMedicamentDto {
  @IsString()
  nom: string;

  @IsString()
  posologie: string;

  @IsDateString()
  dateDebut: Date;

  @IsDateString()
  dateFin: Date;
}

export class CreateTraitementDto {
  listeMedicaments: CreateMedicamentDto[];

  @IsInt()
  animalId: number;
}
