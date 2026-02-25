import { IsInt } from 'class-validator';

export class DeleteAntiParaDto {
  @IsInt()
  animalId: number;
}
