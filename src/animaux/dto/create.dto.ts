import { Type } from 'class-transformer';
import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

enum TypeAnimal {
  CHIEN,
  CHAT,
  OISEAU,
  RONGEUR,
  POISSON,
  CHEVAL,
  REPTILE,
}

enum Genre {
  FEMELLE,
  MALE,
}

export class CreateAnimauxDto {
  @IsString()
  nom: string;

  @IsDateString()
  dateNaissance: string;

  type: TypeAnimal;

  @IsOptional()
  @IsString()
  espece: string;

  @IsOptional()
  @IsString()
  couleur: string;

  @IsOptional()
  @Type(() => Number) // obligatoire
  @IsNumber({ maxDecimalPlaces: 2 })
  poids?: number;

  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  icad: string;

  @IsOptional()
  @IsString()
  pbSante: string;

  @IsOptional()
  genre: Genre;
}
