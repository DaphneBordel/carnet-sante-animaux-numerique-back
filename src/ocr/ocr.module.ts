import { Module } from '@nestjs/common';
import { OcrService } from './ocr.service';
import { OcrController } from './ocr.controller';
import { ConfigService } from '@nestjs/config';
import { MedicamentService } from 'src/medicament/medicament.service';
import { FuseService } from 'src/fuse/fuse.service';
import { ParseOrdonnanceService } from 'src/parse-ordonnance/parse-ordonnance.service';

@Module({
  imports: [],
  providers: [
    OcrService,
    ConfigService,
    MedicamentService,
    FuseService,
    ParseOrdonnanceService,
  ],
  controllers: [OcrController],
})
export class OcrModule {}
