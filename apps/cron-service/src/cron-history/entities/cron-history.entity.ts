import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Cron } from '../../entities/cron.entity';

type CronHistoryDocument = CronHistory & mongoose.Document;

export enum CRON_HISTORY_STATUS {
  PENDING = "PENDING",
  FAILED = "FAILED",
  COMPLETED = "COMPLETED",
}

@Schema({ timestamps: true, collection: "cron-histories" })
class CronHistory extends mongoose.Document {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Cron' })
  cron: Cron

  @Prop({default: CRON_HISTORY_STATUS.PENDING, type: String})
  status?: CRON_HISTORY_STATUS

  @Prop()
  webhookResponse?: string

  @Prop({type: Number})
  webhookResponseCode?: number

}

const CronHistorySchema = SchemaFactory.createForClass(CronHistory);

type CronHistoryTypeWithoutDocument = Omit<CronHistory, keyof mongoose.Document>; // use this in case you are using mongoose lean()

export { CronHistoryDocument, CronHistory, CronHistorySchema, CronHistoryTypeWithoutDocument };
