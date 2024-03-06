import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateCronDTO } from './dto/create-cron.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { UpdateCronDTO } from './dto/update-cron.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return "Hello";
  }
  
  @Get("crons")
  getCrons() {
    return this.appService.getCrons(20)
  }

  @UseGuards(ThrottlerGuard)
  @Post("crons")
  createCron(@Body() reqData: CreateCronDTO) {
    return this.appService.createCron(reqData)
  }

  @UseGuards(ThrottlerGuard)
  @Put("crons/:id")
  updateCron(@Param('id') cronId: string, @Body() reqData: UpdateCronDTO) {
    return this.appService.updateCron(cronId, reqData)
  }

  @Delete("crons/:id")
  deleteCron(@Param('id') cronId: string){
    return this.appService.deleteCron(cronId)
  }
}
