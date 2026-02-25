import { Module } from '@nestjs/common';
import { VermifugeController } from './vermifuge.controller';
import { VermifugeService } from './vermifuge.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { OwnershipService } from 'src/common/validators/ownership.service';

@Module({
  imports: [PrismaModule, JwtModule],
  controllers: [VermifugeController],
  providers: [VermifugeService, OwnershipService],
})
export class VermifugeModule {}
