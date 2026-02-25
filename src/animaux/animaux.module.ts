import { Module } from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { AnimauxController } from './animaux.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AnimauxService, OwnershipService],
  controllers: [AnimauxController],
})
export class AnimauxModule {}
