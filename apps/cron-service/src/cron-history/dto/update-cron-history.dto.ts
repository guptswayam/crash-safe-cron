import { CRON_HISTORY_STATUS } from '../entities/cron-history.entity'

export class UpdateCronHistoryDTO {

  status?: CRON_HISTORY_STATUS

  webhookResponse?: string

  webhookResponseCode?: number
}