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
        date: dto.date,
        nom: dto.nom,
        qtite: dto.qtité,
        dateRappel: dto.dateRappel ? dto.dateRappel : null,
        animalId: dto.animalId,
      },
    });
    return vermifuge;
  }

  async updateVermifuge(
    userId: number,
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
        ...(dto.date && { date: dto.date }),
        ...(dto.nom && { nom: dto.nom }),
        ...(dto.qtité && { qtite: dto.qtité }),
        ...(dto.dateRappel && {
          dateRappel: dto.dateRappel,
        }),
      },
    });
  }
}
