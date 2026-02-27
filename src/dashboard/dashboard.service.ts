import { ForbiddenException, Injectable } from '@nestjs/common';
import { Animal, Medicament } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

type RappelType = 'vaccin' | 'antiparasitaire' | 'vermifuge';

type Rappel = {
  type: RappelType;
  nom: string;
  dateRappel: Date | null;
};

type PreventionGroup = {
  animal: Animal;
  rappels: Rappel[];
};

type TraitementGroup = {
  animal: Animal;
  medicaments: Medicament[];
};

@Injectable()
export class DashboardService {
  constructor(private prismaService: PrismaService) {}

  async getDashboard(userId: number | undefined) {
    const today = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(today.getMonth() + 1);

    if (!userId) throw new ForbiddenException(`L'utilisateur est requis`);
    // ============================
    // 1. TRAITEMENTS EN COURS
    // ============================

    const medicaments = await this.prismaService.medicament.findMany({
      where: {
        traitement: {
          animal: {
            userId,
          },
        },
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

    const traitementsMap = new Map<number, TraitementGroup>();

    for (const med of medicaments) {
      const animal = med.traitement.animal;

      if (!traitementsMap.has(animal.id)) {
        traitementsMap.set(animal.id, {
          animal,
          medicaments: [],
        });
      }

      traitementsMap.get(animal.id)!.medicaments.push(med);
    }

    const traitementsEnCours = Array.from(traitementsMap.values());

    // ============================
    // 2️. PREVENTIONS
    // ============================

    const [vaccins, antiparasitaires, vermifuges] = await Promise.all([
      this.prismaService.vaccin.findMany({
        where: {
          animal: { userId },
          dateRappel: {
            gte: today,
            lte: nextMonth,
          },
        },
        include: { animal: true },
      }),
      this.prismaService.antiparasitaire.findMany({
        where: {
          animal: { userId },
          dateRappel: {
            gte: today,
            lte: nextMonth,
          },
        },
        include: { animal: true },
      }),
      this.prismaService.vermifuge.findMany({
        where: {
          animal: { userId },
          dateRappel: {
            gte: today,
            lte: nextMonth,
          },
        },
        include: { animal: true },
      }),
    ]);
    
    const preventionMap = new Map<number, PreventionGroup>();
    const addRappel = (animal: Animal, rappel: Rappel) => {
      if (!preventionMap.has(animal.id)) {
        preventionMap.set(animal.id, {
          animal,
          rappels: [],
        });
      }

      preventionMap.get(animal.id)!.rappels.push(rappel);
    };

    vaccins.forEach((v) =>
      addRappel(v.animal, {
        type: 'vaccin',
        nom: v.nom,
        dateRappel: v.dateRappel,
      }),
    );

    antiparasitaires.forEach((a) =>
      addRappel(a.animal, {
        type: 'antiparasitaire',
        nom: a.nom,
        dateRappel: a.dateRappel,
      }),
    );
    console.log('antiparasitaires', antiparasitaires);
    vermifuges.forEach((v) =>
      addRappel(v.animal, {
        type: 'vermifuge',
        nom: v.nom,
        dateRappel: v.dateRappel,
      }),
    );

    const preventions = Array.from(preventionMap.values());

    // ============================
    // 3. Onglets 'Traitements en cours' et 'Préventions' triés par animal
    // ============================

    return {
      traitementsEnCours,
      preventions,
    };
  }
}
