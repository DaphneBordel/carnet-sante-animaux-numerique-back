import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AnimauxModule } from './animaux/animaux.module';
import { TraitementModule } from './traitement/traitement.module';
import { AntiParasitaireModule } from './anti-parasitaire/anti-parasitaire.module';

@Module({
  imports: [AuthModule, PrismaModule, AnimauxModule, TraitementModule, AntiParasitaireModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
