import {IsEnum, IsISO8601, IsNotEmpty, IsOptional, IsString, IsUrl} from "class-validator"
import { FREQUENCY } from '../entities/cron.entity';

export class UpdateCronDTO {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(FREQUENCY)
  frequency: FREQUENCY

  @IsOptional()
  @IsString()
  apiKey?: string

  @IsNotEmpty()
  @IsUrl()
  webhookLink: string

  @IsNotEmpty()
  @IsISO8601()
  firstTriggerAt: Date
}