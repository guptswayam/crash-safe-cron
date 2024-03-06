import { Module } from '@nestjs/common';
import { CronHistoryService } from './cron-history.service';
import { CronHistoryController } from './cron-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CronHistory, CronHistorySchema } from './entities/cron-history.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CronHistory.name, schema: CronHistorySchema }]),
  ],
  controllers: [CronHistoryController],
  providers: [CronHistoryService],
  exports: [CronHistoryService]
})
export class CronHistoryModule {}
