// medicament.service.ts
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
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

  async fetchMedicamentById(id: string) {
    //console.log('id in fetchMedicamentById', id);
    if (!id) throw new NotFoundException('id de médicament obligatoire');

    try {
      const res = await axios.get(
        `https://medicament-vet.ddns.net/api/medicament/${id}`,
      );
      //console.log('res.data', res.data);
      return res.data;
    } catch (error) {
      console.log('error in fetchMedicamentId', error);
      this.logger.error('Erreur fetch medicaments by id', error);
    }
  }
}
