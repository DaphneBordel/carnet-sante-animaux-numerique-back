import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAntiParaDto } from './dto/create-ap.dto';

@Injectable()
export class AntiParasitaireService {
  constructor(private readonly prismaService: PrismaService) {}

  async addAntiParasitaire(id: number | undefined, dto: CreateAntiParaDto) {}
}
