import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PoidsAnimalService } from './poids-animal.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreatePoidsDto } from './dto/create-poids.dto';

@UseGuards(AuthGuard)
@Controller('poids-animal')
export class PoidsAnimalController {
  constructor(private readonly poidsAnimalService: PoidsAnimalService) {}

  @Post()
  addPoidsAnimal(@Req() req: RequestWithUser, @Body() dto: CreatePoidsDto) {
    return this.poidsAnimalService.addPoidsAnimal(req.user?.sub, dto);
  }

  @Get(':id')
  getPoidsByAnimalId(@Req() req: RequestWithUser, @Param('id') id: number) {
    return this.poidsAnimalService.getPoidsAnimal(req.user?.sub, id);
  }
}
