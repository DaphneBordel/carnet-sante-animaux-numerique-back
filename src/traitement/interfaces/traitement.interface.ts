import { Prisma } from '@prisma/client';

const traitementWithRelationsArgs =
  Prisma.validator<Prisma.traitementDefaultArgs>()({
    include: {
      medicaments: true,
      animaux: true,
    },
  });

export type TraitementWithRelations = Prisma.traitementGetPayload<
  typeof traitementWithRelationsArgs
>;
