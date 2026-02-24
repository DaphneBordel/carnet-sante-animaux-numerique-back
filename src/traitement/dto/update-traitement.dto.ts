import { IsDateString, IsInt, IsString } from 'class-validator';

export class UpdateMedicamentDto {
  @IsString()
  nom: string;

  @IsString()
  dosage: string;

  @IsInt()
  qtite: number;

  @IsInt()
  traitementId: number;
}

export class UpdateTraitementDto {
  @IsDateString()
  date: Date;

  listeMedicaments: UpdateMedicamentDto[];

  @IsInt()
  animalId: number;
}
