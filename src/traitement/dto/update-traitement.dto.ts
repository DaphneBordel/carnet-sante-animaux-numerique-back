import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString } from 'class-validator';

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
  @Type(() => Date)
  @IsDate()
  date: Date;

  listeMedicaments: UpdateMedicamentDto[];

  @IsInt()
  animalId: number;
}
