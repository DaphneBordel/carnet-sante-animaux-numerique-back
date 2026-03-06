// medicament.service.ts
import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface MedicamentApi {
  id: string;
  nom: string;
}

@Injectable()
export class MedicamentService {
  private readonly logger = new Logger(MedicamentService.name);

  async fetchMedicaments(): Promise<MedicamentApi[] | null> {
    try {
      //api médicaments vétérinaires
      const res = await axios.get(
        'https://medicament-vet.ddns.net/api/medicaments/nom-id',
      );
      // Transformer l'objet en tableau [{id, nom}]
      const jsonMedicaments: MedicamentApi[] = [];
      Object.entries(res.data).map((item: [string, number]) => {
        const newMedicament = { id: item[1].toString(), nom: item[0] };
        jsonMedicaments.push(newMedicament);
      });
      return jsonMedicaments;
    } catch (err) {
      this.logger.error('Erreur fetch médicaments', err);
      return [];
    }
  }
}