import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAntiParaDto } from './dto/create-ap.dto';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { Antiparasitaire } from '@prisma/client';

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
        dateRappel: dto.dateRappel?
      }
    })
  }
}
