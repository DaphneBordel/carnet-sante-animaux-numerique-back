import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimauxDto } from './dto/create.dto';
import { Animal } from '@prisma/client';
import { AnimauxWithRelations } from './interface/animal.interface';
import { OwnershipService } from 'src/common/validators/ownership.service';

export enum TypeAnimal {
  CHIEN = 'CHIEN',
  CHAT = 'CHAT',
  CHEVAL = 'CHEVAL',
  OISEAU = 'OISEAU',
  RONGEUR = 'RONGEUR',
  REPTILE = 'REPTILE',
  POISSON = 'POISSON',
}

export enum GenreAnimal {
  FEMELLE = 'FEMELLE',
  MALE = 'MALE',
}

@Injectable()
export class AnimauxService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async createAnimalByUserId(
    id: number | undefined,
    dtoAnimal: CreateAnimauxDto,
  ): Promise<Animal> {
    console.log('id', id);
    if (!id) throw new ForbiddenException('User not exist');

    //On vérifie si l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);

    //On créait l'animal
    const animal = await this.prismaService.$transaction(async (tx) => {
      const animalCreate: Animal = await tx.animal.create({
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
          genre: dtoAnimal.genre ? GenreAnimal[dtoAnimal.genre] : null,
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

  async getAnimauxByUserId(id: number | undefined): Promise<Animal[]> {
    if (!id) throw new NotFoundException('User is undefined');

    await this.ownershipService.verifyUserExists(id);

    const animaux = await this.prismaService.animal.findMany({
      where: { userId: id },
    });
    return animaux;
  }

  async getAnimalByIdWithRelations(
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
                medicaments: true,
              },
            },
            antiparasitaires: true,
            vermifuges: true,
            vaccins: true,
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
  //récupère l'animal sans ses relations (traitements, vermifuges, etc.)
  async getAnimalById(
    id: number | undefined,
    animalId: string,
  ): Promise<Animal> {
    //Si le userId est undefined on rejète la requête immédiatement
    if (!id) throw new NotFoundException('User is undefined');
    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //on vérifie que l'animal appartient à l'utilisateur
    const animal = await this.ownershipService.verifyAnimalOwnership(
      id,
      parseInt(animalId),
    );
    return animal;
  }
}
