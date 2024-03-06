import { Injectable, Logger } from '@nestjs/common';
import { CronDocument, FREQUENCY } from './entities/cron.entity';

import * as cronLib from "node-schedule"

@Injectable()
export class ScheduleCronService {

  private readonly logger = new Logger(ScheduleCronService.name);

  scheduleCron(cronDoc: CronDocument, processCron: (id: string) => void) {
    this.logger.log(`scheduleCron ${cronDoc.firstTriggerAt}`)
    if(cronDoc.firstTriggerAt < new Date()) {
      this.scheduleRecurrenceCron(String(cronDoc._id), cronDoc.frequency, processCron)
    } else {
      this.logger.log(`scheduling one time cron ${cronDoc._id}`)
      cronLib.scheduleJob(String(cronDoc._id), cronDoc.firstTriggerAt, () => {
        this.scheduleRecurrenceCron(String(cronDoc._id), cronDoc.frequency, processCron)
      })
    }
  }

  scheduleRecurrenceCron(_id: string, frequency: FREQUENCY, processCron: (id: string) => void) {
    this.logger.log(`scheduleRecurrenceCron ${_id}`)
    let cronExpression: string

    switch(frequency) {
      case FREQUENCY.MONTHLY:
        cronExpression = "30 0 3 1 * *"
        break
      case FREQUENCY.WEEKLY:
        cronExpression = "30 0 4 * * 0"
        break
      case FREQUENCY.DAILY:
        cronExpression = "30 0 5 * * *"
        break
      case FREQUENCY.HOURLY:
        cronExpression = "30 0 * * * *"
        break
      case FREQUENCY.MINUTELY:
        cronExpression = "30 * * * * *"
        break
      default: 
        cronExpression = "30 0 3 1 * *"
    }

    cronLib.scheduleJob("recurring-" + String(_id), cronExpression, () => {
      processCron(_id)
    })

  }

  deleteScheduledCron(id: string) {
    const job = cronLib.scheduledJobs[id]

    if(!job) {
      this.logger.warn(`deleteScheduledCron, Job Id not found: ${id}`)
      return false
    }

    job.cancel()

    this.logger.log(`Job Deleted: ${id}`)
    return true

  }

}