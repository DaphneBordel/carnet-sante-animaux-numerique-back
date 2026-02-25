import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateTraitementDto } from './dto/create-traitement.dto';
import { TraitementWithRelations } from './interfaces/traitement.interface';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Injectable()
export class TraitementService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async createTraitementByAnimal(
    userId: number | undefined,
    dtoTraitement: CreateTraitementDto,
  ): Promise<TraitementWithRelations> {
    if (!userId) throw new NotFoundException('User not exist');

    //Si le userId est undefined on rejète la requête immédiatement
    if (!userId) throw new NotFoundException('User is undefined');
    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(userId);
    //on vérifie que l'animal appartient à l'utilisateur
    const animal = await this.ownershipService.verifyAnimalOwnership(
      userId,
      dtoTraitement.animalId,
    );

    // Crée le traitement et les médicaments dans une transaction
    const traitement = await this.prismaService.$transaction(async (tx) => {
      // Création du traitement
      const newTraitement = await tx.traitement.create({
        data: {
          animalId: animal.id,
        },
      });

      // Création des médicaments associés
      await Promise.all(
        dtoTraitement.listeMedicaments.map((med) =>
          tx.medicament.create({
            data: {
              nom: med.nom,
              posologie: med.posologie,
              traitementId: newTraitement.id,
              dateDebut: med.dateDebut,
              dateFin: med.dateFin,
            },
          }),
        ),
      );

      // Récupération du traitement complet avec relations
      const traitementWithRelations = await tx.traitement.findUnique({
        where: { id: newTraitement.id },
        include: {
          animal: true, // inclut les infos de l'animal
          medicaments: true, // inclut les médicaments
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
