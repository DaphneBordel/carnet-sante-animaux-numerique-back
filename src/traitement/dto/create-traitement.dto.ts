import { IsDateString, IsInt, IsOptional, IsString } from 'class-validator';

export class CreateMedicamentDto {
  @IsString()
  nom: string;

  @IsString()
  posologie: string;

  @IsDateString()
  dateDebut: string;

  @IsOptional()
  @IsDateString()
  dateFin?: string;
}

export class CreateTraitementDto {
  listeMedicaments: CreateMedicamentDto[];

  @IsInt()
  animalId: number;
}
