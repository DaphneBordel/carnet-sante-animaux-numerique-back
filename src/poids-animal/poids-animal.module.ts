import { Module } from '@nestjs/common';
import { PoidsAnimalController } from './poids-animal.controller';
import { PoidsAnimalService } from './poids-animal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PoidsAnimalController],
  providers: [PoidsAnimalService],
})
export class PoidsAnimalModule {}
