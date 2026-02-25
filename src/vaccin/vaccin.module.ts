import { Module } from '@nestjs/common';
import { VaccinController } from './vaccin.controller';
import { VaccinService } from './vaccin.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [VaccinController],
  providers: [VaccinService, OwnershipService],
})
export class VaccinModule {}
