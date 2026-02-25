import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnimauxModule } from './animaux/animaux.module';
import { TraitementModule } from './traitement/traitement.module';
import { AntiParasitaireModule } from './anti-parasitaire/anti-parasitaire.module';
import { PoidsAnimalModule } from './poids-animal/poids-animal.module';
import { VaccinModule } from './vaccin/vaccin.module';
import { VermifugeModule } from './vermifuge/vermifuge.module';

@Module({
  imports: [AuthModule, PrismaModule, AnimauxModule, TraitementModule, AntiParasitaireModule, PoidsAnimalModule, VaccinModule, VermifugeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
