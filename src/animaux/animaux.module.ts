import { Module } from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { AnimauxController } from './animaux.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [PrismaModule, JwtModule],
  providers: [AnimauxService],
  controllers: [AnimauxController],
})
export class AnimauxModule {}
