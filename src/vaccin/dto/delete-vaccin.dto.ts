import { IsInt } from 'class-validator';

export class DeleteVaccinDto {
  @IsInt()
  animalId: number;
}
