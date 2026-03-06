import { Module } from '@nestjs/common';
import { ParseOrdonnanceService } from './parse-ordonnance.service';
import { FuseService } from 'src/fuse/fuse.service';
import { MedicamentService } from 'src/medicament/medicament.service';

@Module({
  providers: [ParseOrdonnanceService, FuseService, MedicamentService],
  exports: [ParseOrdonnanceModule],
})
export class ParseOrdonnanceModule {}
