import { IsDateString, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

enum TypeAnimal {
  CHIEN,
  CHAT,
  OISEAU,
  RONGEUR,
  POISSON,
  CHEVAL,
  REPTILE,
}

export class CreateAnimauxDto {
  @IsString()
  nom: string;

  @IsDateString()
  dateNaissance: Date;

  type: TypeAnimal;

  @IsString()
  espece: string;

  @Type(() => Number) // 🔥 obligatoire
  @IsNumber({ maxDecimalPlaces: 2 })
  poids: number;

  @IsString()
  image: string;

  @IsString()
  icad: string;

  @IsString()
  pbSante: string;
}
