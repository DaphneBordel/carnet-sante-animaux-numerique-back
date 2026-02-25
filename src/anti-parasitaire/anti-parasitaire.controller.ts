import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AntiParasitaireService } from './anti-parasitaire.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateAntiParaDto } from './dto/create-ap.dto';

@UseGuards(AuthGuard)
@Controller('anti-parasitaire')
export class AntiParasitaireController {
  constructor(
    private readonly antiParasitaireService: AntiParasitaireService,
  ) {}

  @Post()
  addAntiParasitaire(
    @Req() req: RequestWithUser,
    @Body() dto: CreateAntiParaDto,
  ) {
    return this.antiParasitaireService.addAntiParasitaire(req.user?.sub, dto);
  }
}
