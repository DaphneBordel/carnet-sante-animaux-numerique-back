import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTraitementDto } from './dto/create-traitement.dto';
import { TraitementWithRelations } from './interfaces/traitement.interface';

@Injectable()
export class TraitementService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTraitementByAnimal(
    userId: number | undefined,
    dtoTraitement: CreateTraitementDto,
  ): Promise<TraitementWithRelations> {
    if (!userId) throw new NotFoundException('User not exist');

    // Vérifie que le user existe et récupère ses animaux
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      include: { animaux: true },
    });
    if (!user) throw new NotFoundException('User not exist');

    // Vérifie que l'animal appartient à l'utilisateur
    const animal = user.animaux.find(
      (animal) => animal.id === dtoTraitement.animalId,
    );
    if (!animal) throw new NotFoundException('Animal not found');

    // Crée le traitement et les médicaments dans une transaction
    const traitement = await this.prismaService.$transaction(async (tx) => {
      // Création du traitement
      const newTraitement = await tx.traitement.create({
        data: {
          date: new Date(dtoTraitement.date),
          animal: { connect: { id: animal.id } },
        },
      });

      // Création des médicaments associés
      await Promise.all(
        dtoTraitement.listeMedicaments.map((med) =>
          tx.medicament.create({
            data: {
              nom: med.nom,
              dosage: med.dosage,
              nbJour: med.nbJour,
              traitementId: newTraitement.id,
            },
          }),
        ),
      );

      // Récupération du traitement complet avec relations
      const traitementWithRelations = await tx.traitement.findUnique({
        where: { id: newTraitement.id },
        include: {
          animal: true, // inclut les infos de l'animal
          listeMedicaments: true, // inclut les médicaments
        },
      });

      if (!traitementWithRelations) {
        throw new NotFoundException('Traitement not found after creation');
      }

      return traitementWithRelations;
    });

    return traitement;
  }
}
