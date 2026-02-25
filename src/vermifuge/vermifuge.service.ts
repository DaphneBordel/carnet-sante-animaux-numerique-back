import { CreateVermifugeDto } from './dto/create-vermifuge.dto';
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { Vermifuge } from '@prisma/client';
import { UpdateVermifugeDto } from './dto/update-vermifuge.dto';

@Injectable()
export class VermifugeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async addVermifuge(
    id: number | undefined,
    dto: CreateVermifugeDto,
  ): Promise<Vermifuge> {
    //Si le userId est undefined on rejète la requête immédiatement
    if (!id) throw new ForbiddenException('User is required');

    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //on vérifie que l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, dto.animalId);

    const vermifuge = await this.prismaService.vermifuge.create({
      data: {
        date: dto.date ? new Date(dto.date) : undefined,
        nom: dto.nom,
        qtite: dto.qtite,
        dateRappel: dto.dateRappel ? new Date(dto.dateRappel) : null,
        animalId: dto.animalId,
      },
    });
    return vermifuge;
  }

  async updateVermifuge(
    userId: number | undefined,
    vermifugeId: number,
    dto: UpdateVermifugeDto,
  ) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    //vérifie que l'animal appartient à ce user
    await this.ownershipService.verifyAnimalOwnership(userId, dto.animalId);

    // Vérifie que le vermifuge appartient à cet animal
    const vermifuge = await this.prismaService.vermifuge.findFirst({
      where: {
        id: vermifugeId,
        animalId: dto.animalId,
      },
    });

    if (!vermifuge) {
      throw new NotFoundException('Vermifuge not found');
    }

    // Update partiel
    return this.prismaService.vermifuge.update({
      where: { id: vermifugeId },
      data: {
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.nom && { nom: dto.nom }),
        ...(dto.qtite && { qtite: dto.qtite }),
        ...(dto.dateRappel && {
          dateRappel: new Date(dto.dateRappel),
        }),
      },
    });
  }

  async deleteVermifuge(
    userId: number | undefined,
    vermifugeId: number,
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

    // Vérifie que le vermifuge appartient à cet animal
    const vermifuge = await this.prismaService.vermifuge.findFirst({
      where: {
        id: vermifugeId,
        animalId: animalId,
      },
    });

    if (!vermifuge) {
      throw new NotFoundException('Vermifuge not found');
    }

    // Suppression
    await this.prismaService.vermifuge.delete({
      where: { id: vermifugeId },
    });

    return { message: 'Vermifuge deleted successfully' };
  }
}
