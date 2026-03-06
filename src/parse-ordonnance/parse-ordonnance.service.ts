// parse-ordonnance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { FuseService } from 'src/fuse/fuse.service';
import {
  MedicamentApi,
  MedicamentService,
} from 'src/medicament/medicament.service';

export interface ParsedTraitement {
  medicament: MedicamentApi;
  dose: string | null;
  duree: string | null;
}

export interface GroupedMedicamentApi {
  id: number;
  nom: string;
  description: string;
  word: string;
}

interface MedBlock {
  medicament: string;
  description: string;
}

@Injectable()
export class ParseOrdonnanceService {
  constructor(
    private readonly fuseService: FuseService,
    private readonly medicamentService: MedicamentService,
  ) {}

  cleanText(text: string): string {
    return text
      .replace(/\n/g, ' ')
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .toUpperCase()
      .trim();
  }

  extractMedBlocks(text: string): MedBlock[] {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const results: MedBlock[] = [];

    let currentMed: string | null = null;
    let currentDesc: string[] = [];

    for (const line of lines) {
      // détecte "1 ) MEDICAMENT"
      const medMatch = line.match(/^\d+\s*\)?\s*(.+)$/);

      if (medMatch) {
        if (currentMed) {
          results.push({
            medicament: currentMed,
            description: currentDesc.join(' '),
          });
        }

        currentMed = medMatch[1];
        currentDesc = [];
      } else if (currentMed) {
        currentDesc.push(line);
      }
    }

    if (currentMed) {
      results.push({
        medicament: currentMed,
        description: currentDesc.join(' '),
      });
    }

    return results;
  }

  async parse(parseText: { medicament: string; description: string }[]) {
    // Requêter les médicaments vétérinaires référencés par l'API
    const listeMedicaments: MedicamentApi[] | null =
      await this.medicamentService.fetchMedicaments();
    if (!listeMedicaments)
      throw new NotFoundException(
        'Liste de médicaments du dictionnaire non trouvé',
      );
    // Trouver les médicaments dans le texte ocr scanné
    const medFound: GroupedMedicamentApi[] = [];
    parseText.map((text) => {
      listeMedicaments.filter((el) => {
        if (text.medicament.split(' ').includes(el.nom.split(' ')[0])) {
          const newData: {
            word: string;
            id: number;
            nom: string;
            description: string;
          } = {
            word: el.nom.split(' ')[0],
            description: text.description,
            id: parseInt(el.id),
            nom: el.nom,
          };
          medFound.push(newData);
        }
      });
    });
    console.log('medFOund', medFound);
    //On regroupe tous les médicaments qui ont le même nom (dosage différent)
    const grouped: Record<string, MedicamentApi[]> = medFound.reduce(
      (acc, med) => {
        if (!acc[med.word]) {
          acc[med.word] = {
            liste: [],
            description: med.description,
          };
        }
        acc[med.word].liste.push({
          id: Number(med.id),
          nom: med.nom,
        });
        return acc;
      },
      {},
    );
    console.log('grouped', grouped);
    return grouped;
    /*const medicamentsFound: MedicamentApi[] | null =
      await this.medicamentService.fetchMedicaments();

    if (!medicamentsFound)
      throw new NotFoundException(
        'Liste des médicaments du dictionnaire non disponibles',
      );

    //On cherche si certains mots co
    words.forEach((word) => {
      const med = this.fuseService.search(word);
      console.log('med', med);
      if (medicamentsFound) {
        /*medicamentsFound.find((m) => {
          console.log('m', m);
        });*/
    /*}
      if (med && !medicamentsFound.find((m) => console.log('m', m))) {
        medicamentsFound.push(med);
      }*/
    /*});*/
    /*words.map((word, i) => {
      const search = this.fuseService.search(word);
      doses.map((dose) => {
        if (dose.unit === word) {
          console.log('word', `${words[i - 2]} ${words[i - 1]} ${words[i]}`);
        }
      });
    });

    // Retourner un tableau structuré avec correspondance doses/durées
    /*return medicamentsFound.map((med, index) => ({
      medicament: med,
      dose: doses[index] ?? null,
      duree: durees[index] ?? null,
    }));*/
    /* return null;*/
  }
}
