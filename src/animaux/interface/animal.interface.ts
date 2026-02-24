import { Prisma } from '@prisma/client';

const animalWithRelationsArgs = Prisma.validator<Prisma.AnimauxDefaultArgs>()({
  include: {
    traitements: {
      include: {
        listeMedicaments: true,
      },
    },
  },
});

export type AnimauxWithRelations = Prisma.AnimauxGetPayload<
  typeof animalWithRelationsArgs
>;
