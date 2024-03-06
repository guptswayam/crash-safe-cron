import { Controller, Get, Query } from '@nestjs/common';
import { CronHistoryService } from './cron-history.service';

@Controller('cron-history')
export class CronHistoryController {
  constructor(private readonly cronHistoryService: CronHistoryService) {}

  @Get()
  getCronHistory(@Query() queryParams: Record<string, string>) {
    return this.cronHistoryService.getCronHistory(queryParams)
  }

}
