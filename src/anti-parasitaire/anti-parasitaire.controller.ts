import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { AntiParasitaireService } from './anti-parasitaire.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateAntiParaDto } from './dto/create-ap.dto';
import { UpdateAntiParaDto } from './dto/update-ap.dto';
import { DeleteVermifugeDto } from 'src/vermifuge/dto/delete-vermifuge.dto';

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

  @Put(':id')
  updateVermifuge(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateAntiParaDto,
  ) {
    return this.antiParasitaireService.updateAntiParasitaire(
      req.user?.sub,
      id,
      dto,
    );
  }

  @Delete(':id')
  deleteVermifuge(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Body() dto: DeleteVermifugeDto,
  ) {
    return this.antiParasitaireService.deleteAntiParasitaire(
      req.user?.sub,
      id,
      dto.animalId,
    );
  }
}
