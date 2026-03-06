import { Module } from '@nestjs/common';
import { MedicamentService } from './medicament.service';

@Module({
  providers: [MedicamentService],
  exports: [MedicamentModule],
})
export class MedicamentModule {}
