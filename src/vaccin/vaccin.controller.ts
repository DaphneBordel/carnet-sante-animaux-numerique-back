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
import { VaccinService } from './vaccin.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateVaccinDto } from './dto/create-vaccin.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { UpdateVaccinDto } from './dto/update-vaccin.dto';
import { DeleteVaccinDto } from './dto/delete-vaccin.dto';

@UseGuards(AuthGuard)
@Controller('vaccin')
export class VaccinController {
  constructor(private readonly vaccinService: VaccinService) {}

  @Post()
  addVaccin(@Req() req: RequestWithUser, @Body() dto: CreateVaccinDto) {
    return this.vaccinService.addVaccin(req.user?.sub, dto);
  }

  @Put(':id')
  updateVaccin(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateVaccinDto,
  ) {
    return this.vaccinService.updateVaccin(req.user?.sub, id, dto);
  }

  @Delete(':id')
  deleteVermifuge(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Body() dto: DeleteVaccinDto,
  ) {
    return this.vaccinService.deleteVaccin(req.user?.sub, id, dto.animalId);
  }
}
