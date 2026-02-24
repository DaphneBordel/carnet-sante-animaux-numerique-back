import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';

import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateTraitementDto } from './dto/create-traitement.dto';
import { TraitementService } from './traitement.service';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('traitement')
export class TraitementController {
  constructor(private readonly traitementService: TraitementService) {}

  @Post()
  addTraitementByAnimalId(
    @Req() req: RequestWithUser,
    @Body() createTraitementDto: CreateTraitementDto,
  ) {
    return this.traitementService.createTraitementByAnimal(
      req.user?.sub,
      createTraitementDto,
    );
  }
}
