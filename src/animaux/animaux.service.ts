import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAnimauxDto } from './dto/create.dto';
import { Animal } from '@prisma/client';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { UpdateAnimauxDto } from './dto/update.dto';

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

//fonction pour regrouper les antiparasitaires, vaccins et vermifuges par année
function groupByYear<T>(items: T[], dateKey: keyof T) {
  return items.reduce(
    (acc, item) => {
      const date = new Date(item[dateKey] as unknown as string);
      const year = date.getFullYear();

      if (!acc[year]) {
        acc[year] = [];
      }

      acc[year].push(item);

      return acc;
    },
    {} as Record<number, T[]>,
  );
}

//détermine la date de référence d'un traitement
function getTraitementDate(traitement) {
  if (!traitement.medicaments.length) return null;

  return traitement.medicaments.reduce((latest, med) => {
    return med.dateDebut > latest ? med.dateDebut : latest;
  }, traitement.medicaments[0].dateDebut);
}
//fonction pour trier les traitements par année
function groupTraitementsByYear(traitements) {
  return traitements.reduce((acc, traitement) => {
    const date = getTraitementDate(traitement);
    if (!date) return acc;

    const year = date.getFullYear();

    if (!acc[year]) {
      acc[year] = [];
    }

    acc[year].push(traitement);

    return acc;
  }, {});
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
    console.log('user Id', id);
    console.log(typeof id);
    if (!id) throw new ForbiddenException('User not exist');

    //On vérifie si l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);

    //On créait l'animal
    const animal = await this.prismaService.$transaction(async (tx) => {
      console.log("j'entre dans la transaction");
      const animalCreate: Animal = await tx.animal.create({
        data: {
          userId: id,
          nom: dtoAnimal?.nom,
          dateNaissance: new Date(dtoAnimal?.dateNaissance),
          type: dtoAnimal.type ? TypeAnimal[dtoAnimal.type] : 'CHIEN',
          espece: dtoAnimal.espece,
          couleur: dtoAnimal.couleur,
          icad: dtoAnimal.icad,
          image: dtoAnimal.image,
          pbSante: dtoAnimal.pbSante,
          genre: dtoAnimal.genre ? GenreAnimal[dtoAnimal.genre] : 'MALE',
        },
      });
      console.log('animalCreate', animalCreate);
      if (!animalCreate) {
        console.log('bad request animalCreate');
        throw new BadRequestException(
          `Une erreur est survenue lors de la création [animalCreate error]`,
        );
      }
      if (dtoAnimal.poids) {
        await tx.poids.create({
          data: {
            kilo: dtoAnimal?.poids,
            animalId: animalCreate.id,
          },
        });
      }

      return animalCreate;
    });
    console.log('animal', animal);
    if (!animal) {
      console.log('bad request');
      throw new BadRequestException(
        `Une erreur est survenue lors de la création [transaction error]`,
      );
    }
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

  async getAnimalByIdWithRelations(id: number | undefined, animalId: string) {
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

    existingAnimaux.traitements.sort((a, b) => {
      const dateA = getTraitementDate(a);
      const dateB = getTraitementDate(b);

      if (!dateA || !dateB) return 0;

      return dateB.getTime() - dateA.getTime(); // décroissant
    });

    return {
      ...existingAnimaux,
      traitements: groupTraitementsByYear(existingAnimaux.traitements),
      antiparasitaires: groupByYear(existingAnimaux.antiparasitaires, 'date'),
      vermifuges: groupByYear(existingAnimaux.vermifuges, 'date'),
      vaccins: groupByYear(existingAnimaux.vaccins, 'date'),
    };
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

  async updateAnimalById(
    id: number | undefined,
    animalId: number,
    dto: UpdateAnimauxDto,
    file: Express.Multer.File,
  ) {
    if (!id) throw new ForbiddenException('User not exist');

    //On vérifie si l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //On vérifie si l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, animalId);

    const updateData = { ...dto };

    if (file) {
      // Ici tu peux sauvegarder l'image localement ou sur Cloud et stocker l'URL
      // Par exemple pour tester : animal.image = file.filename ou file.path
      updateData.image = file.path || file.filename;
    }

    return this.prismaService.animal.update({
      where: { id: animalId },
      data: updateData,
    });
  }

  async updateAnimalImage(
    id: number | undefined,
    animalId: string | undefined,
    file: Express.Multer.File,
  ) {
    if (!id) throw new ForbiddenException('User not exist');

    if (!animalId) throw new ForbiddenException('Animal not exist');
    //On vérifie si l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //On vérifie si l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, parseInt(animalId));

    const imageUrl = `uploads/${file.filename}`;

    return this.prismaService.animal.update({
      where: { id },
      data: { image: imageUrl },
    });
  }

  async deleteAnimalByIdWithRelations(
    userId: number | undefined,
    animalId: string,
  ) {
    if (!userId) throw new ForbiddenException('User not exist');

    if (!animalId) throw new ForbiddenException('Animal not exist');

    //On vérifie si l'utilisateur existe
    await this.ownershipService.verifyUserExists(userId);
    //On vérifie si l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(
      userId,
      parseInt(animalId),
    );
    console.log('animalId', animalId);
    try {
      await this.prismaService.animal.delete({
        where: {
          id: parseInt(animalId),
        },
        include: {
          traitements: true,
          vermifuges: true,
          antiparasitaires: true,
          vaccins: true,
        },
      });
    } catch (err) {
      console.log('error delete animal', err);
      throw new BadRequestException('Animal delete error');
    }
  }
}
