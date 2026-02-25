import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePoidsDto } from './dto/create-poids.dto';
import { Poids } from '@prisma/client';

@Injectable()
export class PoidsAnimalService {
  constructor(private readonly prismaService: PrismaService) {}

  async addPoidsAnimal(
    id: number | undefined,
    dto: CreatePoidsDto,
  ): Promise<Poids> {
    //on recherche si l'utilisateur existe et si l'animal lui appartient bien
    if (!id) throw new ForbiddenException('User not authorized');

    const user = await this.prismaService.user.findUnique({
      where: { id },
      include: {
        animaux: true,
      },
    });
    if (!user) throw new NotFoundException('User is not found');

    const animalExist = user.animaux.find(
      (animal) => animal.id === dto.animalId,
    );
    if (!animalExist) throw new NotFoundException('Animal does not exist');

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
