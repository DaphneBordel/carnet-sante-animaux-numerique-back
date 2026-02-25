import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { VaccinService } from './vaccin.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateVaccinDto } from './dto/create-vaccin.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('vaccin')
export class VaccinController {
  constructor(private readonly vaccinService: VaccinService) {}

  @Post()
  addVaccin(@Req() req: RequestWithUser, @Body() dto: CreateVaccinDto) {
    return this.vaccinService.addVaccin(req.user?.sub, dto);
  }
}
