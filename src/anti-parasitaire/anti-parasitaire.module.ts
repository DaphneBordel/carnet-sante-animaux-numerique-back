import { Module } from '@nestjs/common';
import { AntiParasitaireController } from './anti-parasitaire.controller';
import { AntiParasitaireService } from './anti-parasitaire.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [AntiParasitaireController],
  providers: [AntiParasitaireService],
})
export class AntiParasitaireModule {}
