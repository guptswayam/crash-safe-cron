import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

type CronDocument = Cron & mongoose.Document;


export enum FREQUENCY {
  MINUTELY = "MINUTELY",
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY"
}


@Schema({ timestamps: true })
class Cron extends mongoose.Document {
  @Prop({ required: true})
  name: string;

  @Prop({required: true, type: String})
  frequency: FREQUENCY

  @Prop()
  apiKey?: string

  @Prop({ required: true})
  webhookLink: string

  @Prop({required: true})
  firstTriggerAt: Date

}

const CronSchema = SchemaFactory.createForClass(Cron);

type CronTypeWithoutDocument = Omit<Cron, keyof mongoose.Document>; // use this in case you are using mongoose lean()

export { CronDocument, Cron, CronSchema, CronTypeWithoutDocument };
