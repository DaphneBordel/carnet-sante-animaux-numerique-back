import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Vaccin } from '@prisma/client';
import { OwnershipService } from 'src/common/validators/ownership.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVaccinDto } from './dto/create-vaccin.dto';
import { UpdateVaccinDto } from './dto/update-vaccin.dto';

@Injectable()
export class VaccinService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async addVaccin(
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
        dateRappel: dto.dateRappel ? new Date(dto.dateRappel) : null,
        animalId: dto.animalId,
      },
    });
    return vaccin;
  }

  async updateVaccin(
    userId: number | undefined,
    vaccinId: number,
    dto: UpdateVaccinDto,
  ) {
    if (!userId) {
      throw new NotFoundException('User not found');
    }
    //vérifie que l'animal appartient à ce user
    await this.ownershipService.verifyAnimalOwnership(userId, dto.animalId);

    // Vérifie que le vermifuge appartient à cet animal
    const vaccin = await this.prismaService.vaccin.findFirst({
      where: {
        id: vaccinId,
        animalId: dto.animalId,
      },
    });

    if (!vaccin) {
      throw new NotFoundException('Vaccin not found');
    }

    // Update partiel
    return this.prismaService.vaccin.update({
      where: { id: vaccinId },
      data: {
        ...(dto.date && { date: new Date(dto.date) }),
        ...(dto.nom && { nom: dto.nom }),
        ...(dto.dateRappel && {
          dateRappel: new Date(dto.dateRappel),
        }),
      },
    });
  }

  async deleteVaccin(
    userId: number | undefined,
    vaccinId: number,
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

    // Vérifie que le vaccin appartient à cet animal
    const vaccin = await this.prismaService.vaccin.findFirst({
      where: {
        id: vaccinId,
        animalId: animalId,
      },
    });

    if (!vaccin) {
      throw new NotFoundException('Vaccin not found');
    }

    // Suppression
    await this.prismaService.vaccin.delete({
      where: { id: vaccinId },
    });

    return { message: 'Vaccin deleted successfully' };
  }
}
