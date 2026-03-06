import { FileInterceptor } from '@nestjs/platform-express';
import { OcrService } from './ocr.service';
import {
  Controller,
  UploadedFile,
  UseInterceptors,
  Post,
  Body,
} from '@nestjs/common';
import {
  ParsedTraitement,
  ParseOrdonnanceService,
} from 'src/parse-ordonnance/parse-ordonnance.service';
import {
  MedicamentApi,
  MedicamentService,
} from 'src/medicament/medicament.service';
import { FuseService } from 'src/fuse/fuse.service';

@Controller('ocr')
export class OcrController {
  constructor(
    private readonly ocrService: OcrService,
    private readonly medicamentService: MedicamentService,
    private readonly fuseService: FuseService,
    private readonly parseOrdonnanceService: ParseOrdonnanceService,
  ) {}

  @Post('scan')
  @UseInterceptors(FileInterceptor('file'))
  scan(@UploadedFile() file: Express.Multer.File) {
    console.log('je lance mon scan', file);
    return this.ocrService.scanImage(file);
  }
}
