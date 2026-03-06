import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import FormData from 'form-data';
import { FuseService } from 'src/fuse/fuse.service';
import {
  MedicamentApi,
  MedicamentService,
} from 'src/medicament/medicament.service';
import {
  ParsedTraitement,
  ParseOrdonnanceService,
} from 'src/parse-ordonnance/parse-ordonnance.service';

@Injectable()
export class OcrService {
  constructor(
    private configService: ConfigService,
    private fuseService: FuseService,
    private readonly medicamentService: MedicamentService,
    private readonly parseOrdonnanceService: ParseOrdonnanceService,
  ) {}

  async scanImage(file: Express.Multer.File): Promise<{ text: string } | null> {
    const apiKey = process.env.OCR_API_KEY;
    console.log('file', file);
    const form = new FormData();

    form.append('apikey', apiKey);
    form.append('language', 'fre');
    form.append('detectOrientation', 'true');

    form.append('file', file.buffer, {
      filename: file.originalname,
      contentType: file.mimetype,
    });
    console.log('form', form);

    try {
      const response = await axios.post(
        'https://api.ocr.space/parse/image',
        form,
      );
      console.log('response', response.data?.ParsedResults);
      console.log(
        'OCR response',
        response.data?.ParsedResults?.[0]?.ParsedText,
      );
      const ocrText: string = response.data?.ParsedResults?.[0]?.ParsedText;
      console.log('ocrText', ocrText);
      //Récupérer les médicaments
      const medicaments: MedicamentApi[] | null =
        await this.medicamentService.fetchMedicaments();
      //Initialiser Fuse.js
      this.fuseService.init(medicaments);
      //Parser le texte OCR
      const extracted = this.parseOrdonnanceService.extractMedBlocks(ocrText);
      console.log('extracted', extracted);
      const parsed = this.parseOrdonnanceService.parse(extracted);
      console.log('parsed', parsed);
      return null;
    } catch (err) {
      console.log('error', err);
      throw new BadRequestException(err);
    }
  }
}
