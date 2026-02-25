import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OwnershipService {
  constructor(private prisma: PrismaService) {}

  async verifyUserExists(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async verifyAnimalOwnership(userId: number, animalId: number) {
    const animal = await this.prisma.animaux.findFirst({
      where: {
        id: animalId,
        userId: userId,
      },
    });

    if (!animal) {
      throw new NotFoundException(
        'Animal not found or does not belong to user',
      );
    }

    return animal;
  }
}
