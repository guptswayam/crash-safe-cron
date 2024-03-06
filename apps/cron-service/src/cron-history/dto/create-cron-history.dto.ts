import { CRON_HISTORY_STATUS } from '../entities/cron-history.entity'

export class CreateCronHistoryDTO {
  cron: string

  status?: CRON_HISTORY_STATUS

  webhookResponse?: string

  webhookResponseCode?: number
}