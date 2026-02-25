import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { VermifugeService } from './vermifuge.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { CreateVermifugeDto } from './dto/create-vermifuge.dto';
import { UpdateVermifugeDto } from './dto/update-vermifuge.dto';

@UseGuards(AuthGuard)
@Controller('vermifuge')
export class VermifugeController {
  constructor(private readonly vermifugeService: VermifugeService) {}

  @Post()
  addVermifuge(@Req() req: RequestWithUser, @Body() dto: CreateVermifugeDto) {
    return this.vermifugeService.addVermifuge(req.user?.sub, dto);
  }

  @Put(':id')
  updateVermifuge(
    @Param('id') id: number,
    @Req() req: RequestWithUser,
    @Body() dto: UpdateVermifugeDto,
  ) {
    return this.vermifugeService.updateVermifuge(req.user?.sub, id, dto);
  }
}
