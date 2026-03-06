// fuse.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import Fuse from 'fuse.js';
import { MedicamentApi } from 'src/medicament/medicament.service';

@Injectable()
export class FuseService {
  private fuse: Fuse<MedicamentApi>;

  init(medicaments: MedicamentApi[] | null) {
    if (!medicaments)
      throw new NotFoundException('Pas de médicaments initialisés');
    this.fuse = new Fuse(medicaments, {
      keys: ['nom'],
      threshold: 0.4, // tolérance aux erreurs OCR
    });
  }

  search(word: string): MedicamentApi | null {
    if (!this.fuse) return null;
    const result = this.fuse.search(word);
    return result.length > 0 ? result[0].item : null;
  }
}
