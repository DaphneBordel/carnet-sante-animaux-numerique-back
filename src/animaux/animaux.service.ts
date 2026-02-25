import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimauxDto } from './dto/create.dto';
import { Animaux } from '@prisma/client';
import { AnimauxWithRelations } from './interface/animal.interface';

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
    console.log('id', id);
    if (!id) throw new ForbiddenException('User not exist');

    //On vérifie si l'utilisateur existe
    const existingUser = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!existingUser) throw new NotFoundException('User does not exist');

    //On créait l'animal
    const animal = await this.prismaService.$transaction(async (tx) => {
      const animalCreate: Animaux = await tx.animaux.create({
        data: {
          nom: dtoAnimal?.nom,
          dateNaissance: new Date(dtoAnimal?.dateNaissance),
          type: TypeAnimal[dtoAnimal.type],
          espece: dtoAnimal.espece,
          couleur: dtoAnimal.couleur,
          icad: dtoAnimal.icad,
          image: dtoAnimal.image,
          pbSante: dtoAnimal.pbSante,
          userId: id,
        },
      });
      if (!animalCreate)
        throw new BadRequestException(
          `Une erreur est survenue lors de la création [animalCreate error]`,
        );

      await tx.poids.create({
        data: {
          kilo: dtoAnimal?.poids,
          animalId: animalCreate.id,
        },
      });
      return animalCreate;
    });
    if (!animal)
      throw new BadRequestException(
        `Une erreur est survenue lors de la création [transaction error]`,
      );
    return animal;
  }

  async getAnimauxByUserId(
    id: number | undefined,
  ): Promise<AnimauxWithRelations[]> {
    if (!id) throw new NotFoundException('User is undefined');

    const user = await this.prismaService.user.findUnique({
      where: { id },
    });
    if (!user) throw new NotFoundException('User not found');

    const animaux = await this.prismaService.animaux.findMany({
      where: { userId: id },
      include: {
        traitements: {
          include: {
            listeMedicaments: true,
          },
        },
      },
    });
    return animaux;
  }

  async getAnimalById(
    id: number | undefined,
    animalId: string,
  ): Promise<AnimauxWithRelations> {
    if (!id) throw new NotFoundException('User is undefined');

    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        animaux: {
          include: {
            traitements: {
              include: {
                listeMedicaments: true,
              },
            },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('User is not found');

    const existingAnimaux = user.animaux.find(
      (animal) => animal.id === parseInt(animalId),
    );
    if (!existingAnimaux)
      throw new NotFoundException(
        `L'animal n'existe pas ou n'appartient pas à cet utilisateur`,
      );
    return existingAnimaux;
  }
}
