import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import configuration, { ConfigType } from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from "mongoose"
import { Cron, CronSchema } from './entities/cron.entity';
import { ThrottlerModule } from '@nestjs/throttler';
import { ScheduleCronService } from './schedule-cron.service';
import { CronHistoryModule } from './cron-history/cron-history.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV}`,
      load: [configuration],
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService<ConfigType>) => {
        mongoose.set("debug", configService.get('env', {infer: true}) === "development" ? true : false)
        return {
          uri: configService.get('database.connectionString', {infer: true}),
        }
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Cron.name, schema: CronSchema }]),
    ThrottlerModule.forRoot([{
      ttl: 2 * 1000,
      limit: 1,
    }]),
    CronHistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService, ScheduleCronService]
})
export class AppModule {}
