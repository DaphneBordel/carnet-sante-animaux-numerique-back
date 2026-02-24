import { IsDateString, IsInt, IsString } from 'class-validator';

enum Type {
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

  type: Type;

  @IsString()
  espece: string;

  @IsInt()
  poids: number;

  @IsString()
  image: string;

  @IsString()
  icad: string;

  @IsString()
  pbSante: string;
}
