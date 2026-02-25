import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsString } from 'class-validator';

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
  dateNaissance: string;

  type: TypeAnimal;

  @IsString()
  espece: string;

  @IsString()
  couleur: string;

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
