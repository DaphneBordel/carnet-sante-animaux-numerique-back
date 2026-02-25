import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAntiParaDto } from './dto/create-ap.dto';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { Antiparasitaire } from '@prisma/client';
import { UpdateAntiParaDto } from './dto/update-ap.dto';

@Injectable()
export class AntiParasitaireService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async addAntiParasitaire(
    id: number | undefined,
    dto: CreateAntiParaDto,
  ): Promise<Antiparasitaire> {
    //Si le userId est undefined on rejète la requête immédiatement
    if (!id) throw new ForbiddenException('User is required');

    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //on vérifie que l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, dto.animalId);

    const antiParasitaire = await this.prismaService.antiparasitaire.create({
      data: {
        date: dto.date,
        nom: dto.nom,
        qtite: dto.qtité,
        dateRappel: dto.dateRappel ? dto.dateRappel : null,
        animalId: dto.animalId,
      },
    });
    return antiParasitaire;
  }

  async updateAntiParasitaire(
    userId: number | undefined,
    antiParaId: number,
    dto: UpdateAntiParaDto,
  ) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    //vérifie que l'animal appartient à ce user
    await this.ownershipService.verifyAnimalOwnership(userId, dto.animalId);

    // Vérifie que le vermifuge appartient à cet animal
    const antiparasitaire = await this.prismaService.antiparasitaire.findFirst({
      where: {
        id: antiParaId,
        animalId: dto.animalId,
      },
    });

    if (!antiparasitaire) {
      throw new NotFoundException('Antiparasitaire not found');
    }

    // Update partiel
    return this.prismaService.antiparasitaire.update({
      where: { id: antiParaId },
      data: {
        ...(dto.date && { date: dto.date }),
        ...(dto.nom && { nom: dto.nom }),
        ...(dto.qtité && { qtite: dto.qtité }),
        ...(dto.dateRappel && {
          dateRappel: dto.dateRappel,
        }),
      },
    });
  }

  async deleteAntiParasitaire(
    userId: number | undefined,
    antiParaId: number,
    animalId: number,
  ) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    //vérifie que l'animal appartient à ce user
    await this.ownershipService.verifyAnimalOwnership(userId, animalId);

    // Vérifie que l'anti-parasitaire appartient à cet animal
    const antiparasitaire = await this.prismaService.antiparasitaire.findFirst({
      where: {
        id: antiParaId,
        animalId: animalId,
      },
    });

    if (!antiparasitaire) {
      throw new NotFoundException('Antiparasitaire not found');
    }

    // Suppression
    await this.prismaService.antiparasitaire.delete({
      where: { id: antiParaId },
    });

    return { message: 'Antiparasitaire deleted successfully' };
  }
}
