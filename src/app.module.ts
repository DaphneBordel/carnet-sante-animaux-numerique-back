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
import { DashboardModule } from './dashboard/dashboard.module';
import { OcrModule } from './ocr/ocr.module';
import { MedicamentController } from './medicament/medicament.controller';
import { MedicamentModule } from './medicament/medicament.module';
import { FuseModule } from './fuse/fuse.module';
import { ParseOrdonnanceModule } from './parse-ordonnance/parse-ordonnance.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule,
    AnimauxModule,
    TraitementModule,
    AntiParasitaireModule,
    PoidsAnimalModule,
    VaccinModule,
    VermifugeModule,
    DashboardModule,
    OcrModule,
    MedicamentModule,
    FuseModule,
    ParseOrdonnanceModule,
  ],
  controllers: [AppController, MedicamentController],
  providers: [AppService],
})
export class AppModule {}
