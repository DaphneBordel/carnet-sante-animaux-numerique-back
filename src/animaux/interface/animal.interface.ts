import { Prisma } from '@prisma/client';

const animalWithRelationsArgs = Prisma.validator<Prisma.AnimalDefaultArgs>()({
  include: {
    traitements: {
      include: {
        medicaments: true,
      },
    },
    vermifuges: true,
    vaccins: true,
    antiparasitaires: true,
  },
});

export type AnimauxWithRelations = Prisma.AnimalGetPayload<
  typeof animalWithRelationsArgs
>;
