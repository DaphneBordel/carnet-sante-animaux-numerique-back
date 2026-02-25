import { IsDateString, IsInt, IsString } from 'class-validator';

export class CreateMedicamentDto {
  @IsString()
  nom: string;

  @IsString()
  dosage: string;

  @IsInt()
  nbJour: number;
}

export class CreateTraitementDto {
  @IsDateString()
  dateDebut: Date;

  @IsDateString()
  dateFin: Date;

  listeMedicaments: CreateMedicamentDto[];

  @IsInt()
  animalId: number;
}
