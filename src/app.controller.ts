import { Controller, Get, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('onelineaddress')
  getGeocoderFromOnelineaddress(@Query() params) {
    return this.appService.getGeocoderFromOnelineaddress(params);
  }

  @Get('address')
  getGeocoderFromAddress(@Query() params) {
    return this.appService.getGeocoderFromAddress(params);
  }
}
