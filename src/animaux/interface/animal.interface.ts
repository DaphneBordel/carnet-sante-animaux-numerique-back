import { Prisma } from '@prisma/client';

const animalWithRelationsArgs = Prisma.validator<Prisma.AnimalDefaultArgs>()({
  include: {
    traitements: {
      include: {
        medicaments: true,
      },
    },
  },
});

export type AnimauxWithRelations = Prisma.AnimalGetPayload<
  typeof animalWithRelationsArgs
>;
