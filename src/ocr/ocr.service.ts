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
  GroupedMedicamentApi,
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

  async scanImage(file: Express.Multer.File): Promise<GroupedMedicamentApi[]> {
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
      console.log('response', response.data);
      console.log(
        'OCR response',
        response.data?.ParsedResults?.[0]?.ParsedText,
      );
      const ocrText: string = response.data?.ParsedResults?.[0]?.ParsedText;
      //Récupérer les médicaments
      const medicaments: MedicamentApi[] | null =
        await this.medicamentService.fetchMedicaments();
      //Initialiser Fuse.js
      this.fuseService.init(medicaments);
      //Parser le texte OCR
      try {
        const extracted =
          await this.parseOrdonnanceService.extractMedBlocks(ocrText);
        console.log('extracted', extracted);
        if (extracted) {
          try {
            const parsed = await this.parseOrdonnanceService.parse(extracted);
            return parsed;
          } catch (err) {
            console.log('Error to parse orc');
            throw new BadRequestException(err);
          }
        } else {
          throw new BadRequestException('Data extracted is undefined');
        }
      } catch (error) {
        console.log(`Erreur dans l'extraction`, error);
        throw new BadRequestException(error);
      }
    } catch (err) {
      console.log('error', err);
      throw new BadRequestException(err);
    }
    //DONNEE POUR TEST OCR :
    /*const ocrText: string = `I ) INFLACAM 15/ML 5ML \n
      Faire avaler 0.18 mL matin et soir pendant 7 jours. Puis 0.15 mL \n
      matin et soir en continu. \n
      Essayer si possible de trouver la dose minimum efficace. \n
      2 ) BAYTRIL 100/0 15ML \n
      Faire avaler mL matin et soir pendant 3 semaines. \n
      3 ) Nébulisation \n
      Tous les jours au sérum physiologique, environ 10 minutes. \n
      4 ) Panacur 100/0 \n
      Faire avaler une goutte dans le bec matin et soir pendant 5 jours.
      `;
    console.log('ocrText', ocrText);*/
  }
}
