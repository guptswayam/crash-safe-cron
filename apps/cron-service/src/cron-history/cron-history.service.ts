import { Injectable } from '@nestjs/common';
import { CronHistory, CronHistoryDocument } from './entities/cron-history.entity';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateCronHistoryDTO } from './dto/create-cron-history.dto';
import { UpdateCronHistoryDTO } from './dto/update-cron-history.dto';

@Injectable()
export class CronHistoryService {

  constructor(
    @InjectModel(CronHistory.name) private cronHistoryModel: Model<CronHistoryDocument>,
  ) {}

  getCronHistory(params: {cron?: string} = {}) {
    return this.cronHistoryModel.find(params).sort([["createdAt", "desc"]]).limit(20)
  }

  addCronHistory(data: CreateCronHistoryDTO) {
    return this.cronHistoryModel.create(data)
  }

  updateCronHistory(id: string, data: UpdateCronHistoryDTO) {
    return this.cronHistoryModel.findOneAndUpdate({_id: id}, data, {new: true})
  }

}
