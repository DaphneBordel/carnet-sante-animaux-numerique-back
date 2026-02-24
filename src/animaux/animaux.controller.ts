import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateAnimauxDto } from './dto/create.dto';
import { AnimauxService } from './animaux.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';

@Controller('animaux')
export class AnimauxController {
  constructor(private readonly animalService: AnimauxService) {}
  @Post()
  createAnimalByUserId(
    @Req() req: RequestWithUser,
    @Body() dto: CreateAnimauxDto,
  ) {
    return this.animalService.createAnimalByUserId(req.user?.sub, dto);
  }
}
