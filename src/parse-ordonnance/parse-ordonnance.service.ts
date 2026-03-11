// parse-ordonnance.service.ts
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
  word: string;
  description: string;
  duree: string | null;
  liste: ListGroupedMedicamentApi[];
}

export interface ListGroupedMedicamentApi {
  id: number;
  nom: string;
}

interface MedBlock {
  medicament: string;
  description: string;
  duree: string;
}

interface MedGrouped {
  nom: string;
  description: string;
  duree: string | null;
  liste: MedicamentApi[];
}

@Injectable()
export class ParseOrdonnanceService {
  constructor(
    private readonly fuseService: FuseService,
    private readonly medicamentService: MedicamentService,
  ) {}

  async extractMedBlocks(text: string): Promise<MedBlock[] | undefined> {
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    let listeMedicaments: MedicamentApi[] | null;

    try {
      listeMedicaments = await this.medicamentService.fetchMedicaments();
    } catch (error) {
      throw new BadRequestException(error);
    }

    if (!listeMedicaments) return undefined;
    const medKeywords = listeMedicaments.map((m) =>
      m.nom.split(' ')[0].toUpperCase(),
    );

    const regexDuration = /\d+\s*(jours?|semaines?|mois)/gi;
    const regexNumberedMed = /^\s*(\d+|[IVX]+)\s*[\.\)\/]\s*([A-Z0-9\-]+)/i;
    const regexSectionStop = /^[A-ZÉÈÀÂÊÎÔÛÄËÏÖÜÇ][A-Za-zÀ-ÿ\s]+:/;

    const results: MedBlock[] = [];

    let currentMed: string | null = null;
    let descriptionLines: string[] = [];
    let capturingPosologie = false;

    const finalizeBlock = () => {
      if (!currentMed) return;

      const description = descriptionLines.join(' ').trim();

      const durations = [...description.matchAll(regexDuration)].map(
        (m) => m[0],
      );

      const duree = durations.join(', ');

      results.push({
        medicament: currentMed,
        description,
        duree,
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      let detectedMed: string | null = null;

      // --- règle 1 : numérotation
      const numberedMatch = line.match(regexNumberedMed);

      if (numberedMatch) {
        detectedMed = numberedMatch[2];
      }

      // --- règle 2 : médicament présent dans l'API
      if (!detectedMed) {
        const words = upperLine.split(/\s+/);
        const found = words.find((w) => medKeywords.includes(w));
        if (found) detectedMed = found;
      }

      if (detectedMed) {
        finalizeBlock();

        currentMed = detectedMed;
        descriptionLines = [];
        capturingPosologie = false;

        continue;
      }

      // --- règle 4 : mot Posologie
      if (/POSOLOGIE/i.test(line)) {
        capturingPosologie = true;
        continue;
      }

      if (currentMed) {
        if (regexSectionStop.test(line)) {
          finalizeBlock();
          currentMed = null;
          descriptionLines = [];
          capturingPosologie = false;
          continue;
        }

        if (capturingPosologie || descriptionLines.length >= 0) {
          descriptionLines.push(line);
        }
      }
    }

    finalizeBlock();

    return results;
  }

  grouped(
    medFound: {
      word: string;
      id: number;
      nom: string;
      duree: string;
      description: string;
    }[],
  ): GroupedMedicamentApi[] {
    const groupedBlock: GroupedMedicamentApi[] = [];
    medFound.map((med, i) => {
      if (i === 0) {
        groupedBlock.push({
          word: med.word,
          duree: med.duree,
          description: med.description,
          liste: [{ id: med.id, nom: med.nom }],
        });
      } else {
        let elementExist = false;
        groupedBlock.map((gr, j) => {
          //si le médicament existe déjà dans groupedBlock on rajoute uniquement le nom du médicament trouvé à la liste des possibles.
          if (gr.word === med.word) {
            gr.liste.push({ id: med.id, nom: med.nom });
            elementExist = true;
          }
          //on arrive au bout du groupedBlock et on n'a pas trouvé de médicament ayant le même nom : on rajoute un nouveau médicament à groupedBlock
          if (j === groupedBlock.length - 1 && !elementExist) {
            groupedBlock.push({
              word: med.word,
              duree: med.duree,
              description: med.description,
              liste: [{ id: med.id, nom: med.nom }],
            });
          }
        });
      }
    });
    return groupedBlock;
  }

  async parse(
    parseText: { medicament: string; description: string; duree: string }[],
  ) {
    // Requêter les médicaments vétérinaires référencés par l'API
    const listeMedicaments: MedicamentApi[] | null =
      await this.medicamentService.fetchMedicaments();
    if (!listeMedicaments)
      throw new NotFoundException(
        'Liste de médicaments du dictionnaire non trouvé',
      );
    // Trouver les médicaments dans le texte ocr scanné
    const medFound: {
      word: string;
      id: number;
      nom: string;
      description: string;
      duree: string;
    }[] = [];
    //console.log('parseTextTemp', parseTextTemp);
    parseText.map((text, i) => {
      //console.log('text', text);
      let elementIsAdding = false;
      listeMedicaments.filter((el) => {
        if (text.medicament.split(' ').includes(el.nom.split(' ')[0])) {
          const newData: {
            word: string;
            id: number;
            nom: string;
            description: string;
            duree: string;
          } = {
            word: el.nom.split(' ')[0],
            description: text.description,
            id: parseInt(el.id),
            nom: el.nom,
            duree: text.duree,
          };
          medFound.push(newData);
          elementIsAdding = true;
        }
      });
      if (parseText.length - 1 === i && !elementIsAdding) {
        //on ajoute les éléments qui ne figurent pas dans la liste des médicaments connus tel quel
        medFound.push({
          word: '',
          description: text.description,
          id: i,
          nom: text.medicament,
          duree: text.duree,
        });
      }
    });
    console.log('medFOund', medFound);
    const groupedMedicamentsListe = this.grouped(medFound);
    console.log('groupedMedicamentsListe', groupedMedicamentsListe);
    //On regroupe tous les médicaments qui ont le même nom (dosage différent)
    return groupedMedicamentsListe;
  }
}
