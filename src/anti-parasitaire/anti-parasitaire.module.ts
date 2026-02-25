import { Module } from '@nestjs/common';
import { AntiParasitaireController } from './anti-parasitaire.controller';
import { AntiParasitaireService } from './anti-parasitaire.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [AntiParasitaireController],
  providers: [AntiParasitaireService, OwnershipService],
})
export class AntiParasitaireModule {}
