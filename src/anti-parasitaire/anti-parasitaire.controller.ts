import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AntiParasitaireService } from './anti-parasitaire.service';
import { RequestWithUser } from 'src/auth/interfaces/request-with-user';

@UseGuards(AuthGuard)
@Controller('anti-parasitaire')
export class AntiParasitaireController {
  constructor(
    private readonly antiParasitaireService: AntiParasitaireService,
  ) {}

  /*@Post()
  addAntiParasitaire(@Req() req: RequestWithUser, @Body() dto: )*/
}
