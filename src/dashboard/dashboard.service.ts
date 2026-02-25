import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  async getDashboard(userId: number | undefined) {
    if (!userId) throw new NotFoundException('User is required');

    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    const medicamentsEnCours = await this.prismaService.medicament.findMany({
      where: {
        traitement: {
          animal: {
            userId: userId,
          },
        },
        dateDebut: { lte: today },
        dateFin: { gte: today },
      },
      include: {
        traitement: {
          include: {
            animal: true,
          },
        },
      },
    });

    const vermifuges = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    const vaccins = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    const antiparasitaires = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    return {
      medicamentsEnCours,
      rappelsAVenir: {
        vermifuges,
        vaccins,
        antiparasitaires,
      },
    };
  }
}
