import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimauxDto } from './dto/create.dto';
import { Animaux } from '@prisma/client';

export enum TypeAnimal {
  CHIEN = 'CHIEN',
  CHAT = 'CHAT',
  CHEVAL = 'CHEVAL',
  OISEAU = 'OISEAU',
  RONGEUR = 'RONGEUR',
  REPTILE = 'REPTILE',
  POISSON = 'POISSON',
}

@Injectable()
export class AnimauxService {
  constructor(private readonly prismaService: PrismaService) {}

  async createAnimalByUserId(
    id: number | undefined,
    dtoAnimal: CreateAnimauxDto,
  ): Promise<Animaux> {
    if (!id) throw new ForbiddenException('User not exist');

    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) throw new NotFoundException('User does not exist');

    const animal: Animaux = await this.prismaService.animaux.create({
      data: {
        nom: dtoAnimal?.nom,
        dateNaissance: new Date(dtoAnimal?.dateNaissance),
        type: TypeAnimal[dtoAnimal.type],
        espece: dtoAnimal.espece,
        poids: dtoAnimal.poids,
        icad: dtoAnimal.Icad,
        image: dtoAnimal.image,
        pbSante: dtoAnimal.pbSante,
        userId: id,
      },
    });
    return animal;
  }
}
