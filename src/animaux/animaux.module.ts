import { Module } from '@nestjs/common';
import { AnimauxService } from './animaux.service';
import { AnimauxController } from './animaux.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AnimauxService],
  controllers: [AnimauxController],
})
export class AnimauxModule {}
