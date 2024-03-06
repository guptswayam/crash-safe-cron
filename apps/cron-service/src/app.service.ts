import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronDocument } from './entities/cron.entity';
import { Model } from 'mongoose';
import { CreateCronDTO } from './dto/create-cron.dto';
import { ScheduleCronService } from './schedule-cron.service';
import * as moment from 'moment-timezone';
import { UpdateCronDTO } from './dto/update-cron.entity';
import { CRON_HISTORY_STATUS } from './cron-history/entities/cron-history.entity';
import { CronHistoryService } from './cron-history/cron-history.service';
import axios from 'axios';

@Injectable()
export class AppService implements OnApplicationBootstrap {

  constructor(
    @InjectModel(Cron.name) private cronModel: Model<CronDocument>,
    private scheduleCronService: ScheduleCronService,
    private readonly cronHistoryService: CronHistoryService,
  ) {}

  async onApplicationBootstrap() {
    const cronList = await this.getCrons()
    cronList.forEach(cronDoc => {
      this.scheduleCronService.scheduleCron(cronDoc, this.processCron.bind(this))
    })
  }

  getCrons(limit = 0): Promise<CronDocument[]> {
    return this.cronModel.find().sort([["createdAt", "desc"]]).limit(limit);
  }

  async createCron(reqData: CreateCronDTO) {
    reqData.firstTriggerAt = moment(reqData.firstTriggerAt).tz("Asia/Kolkata").toDate()
    const cronDoc = await this.cronModel.create(reqData)

    this.scheduleCronService.scheduleCron(cronDoc, this.processCron.bind(this))

    return cronDoc
  }

  async updateCron(id: string, reqData: UpdateCronDTO) {
    reqData.firstTriggerAt = moment(reqData.firstTriggerAt).tz("Asia/Kolkata").toDate()

    const cron = await this.cronModel.findById(id)

    if(!cron)
      return
    
    for(const key of Object.keys(reqData)) {
      cron[key] = reqData[key]
    }

    cron.apiKey = reqData.apiKey

    await cron.save()

    this.scheduleCronService.deleteScheduledCron(id)
    this.scheduleCronService.deleteScheduledCron("recurring-" + id)

    this.scheduleCronService.scheduleCron(cron, this.processCron.bind(this))

    return cron

  }

  async deleteCron(id: string) {

    const cron = await this.cronModel.findByIdAndDelete(id);

    if(!cron)
      return

    this.scheduleCronService.deleteScheduledCron(id)
    this.scheduleCronService.deleteScheduledCron("recurring-" + id)

    return cron

  }

  getCron(params: Record<any, any> = {}) {
    return this.cronModel.findOne(params)
  }

  async processCron(id: string) {
    const cron = await this.getCron({_id: id})

    const cronHistory = await this.cronHistoryService.addCronHistory({
      cron: String(cron._id),
    })

    let apiRes
    try {
      apiRes = await axios.get(cron.webhookLink, {
        headers: {
          "x-api-key": cron.apiKey
        }
      })
      cronHistory.status = CRON_HISTORY_STATUS.COMPLETED
    } catch (error) {
      apiRes = error.response
      cronHistory.status = CRON_HISTORY_STATUS.FAILED
    }

    cronHistory.webhookResponseCode = apiRes.status

    if(apiRes.data) {
      cronHistory.webhookResponse = typeof apiRes.data === "string" ? apiRes.data : JSON.stringify(apiRes.data)
    }

    await cronHistory.save()

  }

}
