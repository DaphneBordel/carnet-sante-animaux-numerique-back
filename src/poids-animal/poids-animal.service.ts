import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoidsDto } from './dto/create-poids.dto';
import { Poids } from '@prisma/client';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Injectable()
export class PoidsAnimalService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly ownershipService: OwnershipService,
  ) {}

  async addPoidsAnimal(
    id: number | undefined,
    dto: CreatePoidsDto,
  ): Promise<Poids> {
    //on recherche si l'utilisateur existe et si l'animal lui appartient bien
    if (!id) throw new ForbiddenException('User not authorized');

    //Si le userId est undefined on rejète la requête immédiatement
    if (!id) throw new NotFoundException('User is undefined');
    //on vérifie que l'utilisateur existe
    await this.ownershipService.verifyUserExists(id);
    //on vérifie que l'animal appartient à l'utilisateur
    await this.ownershipService.verifyAnimalOwnership(id, dto.animalId);

    const poids: Poids = await this.prismaService.poids.create({
      data: {
        kilo: dto.kilo,
        animalId: dto.animalId,
      },
    });
    if (!poids)
      throw new BadRequestException('An error occured when poids is created');
    return poids;
  }
}
