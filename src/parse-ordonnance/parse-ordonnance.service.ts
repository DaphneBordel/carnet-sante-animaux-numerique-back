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
  dose?: string | null;
  duree: string | null;
}

export interface GroupedMedicamentApi {
  word: string;
  description: string;
  duree: string | null;
  liste: ListGroupedMedicamentApi[];
  type: string;
}

export interface ListGroupedMedicamentApi {
  id: number;
  nom: string;
}

interface MedBlock {
  medicament: string;
  description: string;
  duree: string;
  dose?: string[];
}

type MedicamentApiDetail = {
  codeATCVETList?: string[];
};

@Injectable()
export class ParseOrdonnanceService {
  constructor(
    private readonly fuseService: FuseService,
    private readonly medicamentService: MedicamentService,
  ) {}

  async parse(
    parseText: {
      medicament: string;
      description: string;
      duree: string;
      dose?: string[];
    }[],
  ): Promise<GroupedMedicamentApi[]> {
    const listeMedicaments: MedicamentApi[] | null =
      await this.medicamentService.fetchMedicaments();

    if (!listeMedicaments)
      throw new NotFoundException(
        'Liste de médicaments du dictionnaire non trouvé',
      );

    const medFound: {
      word: string;
      id: number;
      nom: string;
      description: string;
      duree: string;
      type: string;
      dose?: string[];
    }[] = [];

    for (let i = 0; i < parseText.length; i++) {
      const text = parseText[i];
      let elementIsAdding = false;

      for (const el of listeMedicaments) {
        if (text.medicament.split(' ').includes(el.nom.split(' ')[0])) {
          const medicamentApiById: MedicamentApiDetail =
            await this.medicamentService.fetchMedicamentById(el.id);

          const newData = {
            word: el.nom.split(' ')[0],
            description: text.description,
            id: parseInt(el.id),
            nom: el.nom,
            duree: text.duree,
            type: this.getCategorieMedicament(
              medicamentApiById.codeATCVETList ?? [],
            ),
            dose: text.dose,
          };

          medFound.push(newData);
          elementIsAdding = true;
        }
      }

      if (!elementIsAdding) {
        medFound.push({
          word: text.medicament,
          description: text.description,
          id: i,
          nom: text.medicament,
          duree: text.duree,
          type: 'traitement',
          dose: [],
        });
      }
    }

    //console.log('medFound', medFound);

    const groupedMedicamentsListe = this.grouped(medFound);
    console.log('groupedMedicaments', groupedMedicamentsListe[0].liste[0]);
    return groupedMedicamentsListe;
  }
  //extraction des informations de l'ordonnance (transformé en texte)
  // Retourne un tableau de médicaments avec le nom du médicament, sa description et la durée du traitement
  async extractMedBlocks(text: string): Promise<MedBlock[]> {
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

    if (!listeMedicaments) return [];

    const medKeyword = new Set(
      listeMedicaments.map((m) => m.nom.split(' ')[0].toUpperCase()),
    );

    const regexDuration = /\d+\s*(jours?|semaines?|mois)/gi;
    const regexNumberedMed = /^\s*(\d+|[IVX]+)\s*[\.\)\/]\s*([A-Z0-9\-]+)/i;
    const regexSectionStop = /^[A-ZÉÈÀÂÊÎÔÛÄËÏÖÜÇ][A-Za-zÀ-ÿ\s]+:/;

    // Regex pour nombres classiques et OCR "%", ex: 15, 0.5, 100/0
    const regexNumber = /\d+(?:[.,]\d+)?/g;
    const regexPercentOCR = /\b\d+0\/0\b/g;

    const results: MedBlock[] = [];

    let currentMed: string | null = null;
    let currentDoseNumbers: string[] = [];
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
        dose: currentDoseNumbers,
      });
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const upperLine = line.toUpperCase();

      let detectedMed: string | null = null;

      const numberedMatch = line.match(regexNumberedMed);
      if (numberedMatch) {
        detectedMed = numberedMatch[2];
      }

      if (!detectedMed) {
        const words = upperLine.split(/\s+/);
        const found = words.find((w) => medKeyword.has(w));
        if (found) detectedMed = found;
      }

      if (detectedMed) {
        finalizeBlock();

        const indexMed = upperLine.indexOf(detectedMed);
        let detectedNumbers: string[] = [];

        if (indexMed !== -1) {
          const afterMed = line.substring(indexMed + detectedMed.length);

          // 1️⃣ OCR "%", ex: 100/0
          const percentMatches = afterMed.match(regexPercentOCR) ?? [];

          // 2️⃣ Nombres classiques
          const numberMatches = afterMed.match(regexNumber) ?? [];

          // 3️⃣ Fusion en donnant priorité aux OCR %
          detectedNumbers = [
            ...percentMatches,
            ...numberMatches.filter(
              (n) => !percentMatches.some((p) => p.startsWith(n)),
            ),
          ];
          console.log('detectedNumbers', detectedNumbers);
        }

        currentMed = detectedMed;
        currentDoseNumbers = detectedNumbers;
        descriptionLines = [];
        capturingPosologie = false;

        continue;
      }

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

  getCategorieMedicament(atcList: string[]) {
    console.log('code liste', atcList);
    const code = atcList?.[0];

    if (!code) return 'medicament';

    if (code.startsWith('QP52')) return 'vermifuge';
    if (code.startsWith('QP53')) return 'antiparasitaire';
    if (code.startsWith('QI')) return 'vaccin';

    return 'traitement';
  }

  //on groupe les médicaments par nom de médicaments
  //L'api nous retourne tous les médicaments du même nom (dosage qui varie)
  //On retourne à l'utilisateur l'intégralité des médicaments dans une liste.
  grouped(
    medFound: {
      word: string;
      id: number;
      nom: string;
      duree: string;
      description: string;
      dose?: string[];
      type: string;
    }[],
  ): GroupedMedicamentApi[] {
    const groupedBlock: GroupedMedicamentApi[] = [];

    medFound.forEach((med, i) => {
      if (i === 0) {
        groupedBlock.push({
          word: med.word,
          duree: med.duree,
          description: med.description,
          liste: [{ id: med.id, nom: med.nom }],
          type: med.type,
        });
      } else {
        let elementExist = false;

        for (let j = 0; j < groupedBlock.length; j++) {
          const group = groupedBlock[j];
          if (group.word === med.word) {
            group.liste.push({ id: med.id, nom: med.nom });
            elementExist = true;

            // --- Tri selon doses détectées ---
            if (med.dose && med.dose.length > 0) {
              const doses = med.dose.map((d) =>
                /(\d+)0\/0/.test(d)
                  ? `${parseInt(d) / 10}%` // conversion OCR 100/0 → 10%
                  : d,
              );

              group.liste.sort((a, b) => {
                const getPriority = (nom: string) => {
                  // Normalisation : supprime espace avant %
                  const nomNormalized = nom.replace(/\s+%/g, '%');

                  for (let k = 0; k < doses.length; k++) {
                    const dosePattern = doses[k]
                      .replace(/\s+%/g, '%')
                      .replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
                    const regex = new RegExp(dosePattern, 'i');

                    if (regex.test(nomNormalized)) {
                      return k; // priorité selon l'ordre OCR
                    }
                  }

                  return 999; // aucune correspondance
                };

                return getPriority(a.nom) - getPriority(b.nom);
              });
            }

            break;
          }
        }

        if (!elementExist) {
          groupedBlock.push({
            word: med.word,
            duree: med.duree,
            description: med.description,
            liste: [{ id: med.id, nom: med.nom }],
            type: med.type,
          });
        }
      }
    });

    return groupedBlock;
  }
}
