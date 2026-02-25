import { Prisma } from '@prisma/client';

const traitementWithRelationsArgs =
  Prisma.validator<Prisma.TraitementDefaultArgs>()({
    include: {
      medicaments: true,
      animal: true,
    },
  });

export type TraitementWithRelations = Prisma.TraitementGetPayload<
  typeof traitementWithRelationsArgs
>;
