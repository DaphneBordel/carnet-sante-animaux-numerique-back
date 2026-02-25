import { Module } from '@nestjs/common';
import { TraitementService } from './traitement.service';
import { TraitementController } from './traitement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [TraitementService, OwnershipService],
  controllers: [TraitementController],
})
export class TraitementModule {}
