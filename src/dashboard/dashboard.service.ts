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
    console.log('nextMonth', nextMonth);

    const medicamentsEnCours = await this.prismaService.medicament.findMany({
      where: {
        traitement: {
          animal: {
            userId: userId,
          },
        },
        //date de fin >= aujourd'hui
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

    // Regroupement par animal
    const groupedByAnimal = medicamentsEnCours.reduce(
      (acc, medicament) => {
        const animal = medicament.traitement.animal;

        const existingAnimal = acc.find((a) => a.animal.id === animal.id);

        if (existingAnimal) {
          existingAnimal.medicaments.push(medicament);
        } else {
          acc.push({
            animal,
            medicaments: [medicament],
          });
        }

        return acc;
      },
      [] as {
        animal: (typeof medicamentsEnCours)[number]['traitement']['animal'];
        medicaments: typeof medicamentsEnCours;
      }[],
    );

    const vermifuges = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        //date de rappel >= aujourd'hui et <= à dans un mois
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    const vaccins = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        //date de rappel >= aujourd'hui et <= à dans un mois
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    const antiparasitaires = await this.prismaService.vermifuge.findMany({
      where: {
        animal: { userId },
        //date de rappel >= aujourd'hui et <= à dans un mois
        dateRappel: { gte: today, lte: nextMonth },
      },
      include: { animal: true },
    });

    return {
      groupedByAnimal,
      rappelsAVenir: {
        vermifuges,
        vaccins,
        antiparasitaires,
      },
    };
  }
}
