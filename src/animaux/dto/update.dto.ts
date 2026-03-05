import { animaux_type, genre } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';

export class UpdateAnimauxDto {
  @IsString()
  nom: string;

  @IsDateString()
  dateNaissance: string;

  @IsEnum(animaux_type)
  type: animaux_type;

  @IsString()
  espece: string;

  @IsString()
  couleur: string;

  @IsString()
  image: string;

  @IsString()
  icad: string;

  @IsOptional()
  @IsEnum(genre)
  genre?: genre;
}
