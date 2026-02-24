import { Module } from '@nestjs/common';
import { TraitementService } from './traitement.service';
import { TraitementController } from './traitement.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [TraitementService],
  controllers: [TraitementController],
})
export class TraitementModule {}
