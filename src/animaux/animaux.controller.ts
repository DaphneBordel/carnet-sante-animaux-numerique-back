import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateAnimauxDto } from './dto/create.dto';
import { AnimauxService } from './animaux.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
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

  @Get()
  getAnimauxByUserId(@Req() req: RequestWithUser) {
    return this.animalService.getAnimauxByUserId(req.user?.sub);
  }

  @Get(':id')
  getAnimalById(@Param('id') id: string, @Req() req: RequestWithUser) {
    return this.animalService.getAnimalById(req.user?.sub, id);
  }
}
