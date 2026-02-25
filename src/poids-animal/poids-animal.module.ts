import { Module } from '@nestjs/common';
import { PoidsAnimalController } from './poids-animal.controller';
import { PoidsAnimalService } from './poids-animal.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [PoidsAnimalController],
  providers: [PoidsAnimalService, OwnershipService],
})
export class PoidsAnimalModule {}
