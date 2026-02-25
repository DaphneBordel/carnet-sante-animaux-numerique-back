import { ForbiddenException, Injectable } from '@nestjs/common';
import { Vaccin } from '@prisma/client';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVaccinDto } from './dto/create-vaccin.dto';

@Injectable()
export class VaccinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async addAntiParasitaire(
    id: number | undefined,
    dto: CreateVaccinDto,
  ): Promise<Vaccin> {
    //Si le userId est undefined on rejète la requête immédiatement
    if (!id) throw new ForbiddenException('User is required');

    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //on vérifie que l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, dto.animalId);

    const vaccin = await this.prismaService.vaccin.create({
      data: {
        nom: dto.nom,
        dateRappel: dto.dateRappel ? dto.dateRappel : null,
        animalId: dto.animalId,
      },
    });
    return vaccin;
  }
}
