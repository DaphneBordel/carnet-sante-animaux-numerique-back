import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { VermifugeService } from './vermifuge.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateVermifugeDto } from './dto/create-vermifuge.dto';

@UseGuards(AuthGuard)
@Controller('vermifuge')
export class VermifugeController {
  constructor(private readonly vermifugeService: VermifugeService) {}

  @Post()
  addVermifuge(@Req() req: RequestWithUser, @Body() dto: CreateVermifugeDto) {
    return this.vermifugeService.addVermifuge(req.user?.sub, dto);
  }
}
