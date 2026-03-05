import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Delete,
} from '@nestjs/common';
import { CreateAnimauxDto } from './dto/create.dto';
import { AnimauxService } from './animaux.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateAnimauxDto } from './dto/update.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Express } from 'express';

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

  @Patch(':animalId')
  @UseInterceptors(FileInterceptor('image')) // image du FormData
  updateAnimal(
    @Param('animalId') animalId: string,
    @Body() dto: UpdateAnimauxDto,
    @Req() req: RequestWithUser,
    @UploadedFile() file: Express.Multer.File, // image uploadée
  ) {
    return this.animalService.updateAnimalById(
      req.user?.sub,
      parseInt(animalId),
      dto,
      file,
    );
  }

  @Get(':id/details')
  getAnimalByIdWithRelations(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.animalService.getAnimalByIdWithRelations(req.user?.sub, id);
  }

  @Patch(':id/image')
  @UseInterceptors(FileInterceptor('file'))
  async updateAnimalImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.animalService.updateAnimalImage(req.user?.sub, id, file);
  }

  @Delete(':id')
  deleteAnimalByIdWithRelations(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    return this.animalService.deleteAnimalByIdWithRelations(req.user?.sub, id);
  }
}
