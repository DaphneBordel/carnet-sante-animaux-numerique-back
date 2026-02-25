import { IsInt } from 'class-validator';

export class DeleteVermifugeDto {
  @IsInt()
  animalId: number;
}
