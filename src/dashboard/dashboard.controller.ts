import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import type { RequestWithUser } from 'src/auth/interfaces/request-with-user';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('')
  getDashboard(@Req() req: RequestWithUser) {
    return this.dashboardService.getDashboard(req.user?.sub);
  }
}
