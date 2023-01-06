import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { map, switchMap, throwError } from 'rxjs';

@Injectable()
export class AppService {

  constructor(private httpService: HttpService) { }

  getGeocoderFromOnelineaddress({ address }) {
    const url = `https://geocoding.geo.census.gov/geocoder/locations/onelineaddress?benchmark=2020&format=json&address=${address}`
    return this.getGeocoder(url);
  }

  getGeocoderFromAddress({ street, city, state, zip }) {
    const url = `https://geocoding.geo.census.gov/geocoder/locations/address?street=${street}&city=${city}&state=${state}&zip=${zip}&benchmark=2020&format=json`
    return this.getGeocoder(url);
  }

  getGeocoder(url: string) {
    return this.httpService.get(url).pipe(switchMap(addressResponse => {
      if (addressResponse?.data?.result?.addressMatches.length) {
        const { x, y } = addressResponse?.data?.result?.addressMatches[0]?.coordinates;
        return this.getGrid(x, y);
      }
      throw new HttpException('No Address Matches Found!', HttpStatus.NOT_FOUND);
    }));
  }

  getGrid(x: string, y: string) {
    const gridUrl = `https://api.weather.gov/points/${y},${x}`;
    return this.httpService.get(gridUrl).pipe(switchMap(gridResponse => {
      if (gridResponse?.data?.properties?.forecast) {
        return this.getForecast(gridResponse?.data?.properties?.forecast);
      }
      throw new HttpException('Forecast not available, please try later', HttpStatus.NOT_FOUND);
    }));
  }

  getForecast(url: string) {
    return this.httpService.get(url).pipe(map(forecastResponse => {
      if (forecastResponse?.data?.properties?.periods?.length) {
        const { periods } = forecastResponse?.data?.properties;
        return periods;
      }
      throw new HttpException('Forecast not available, please try later', HttpStatus.NOT_FOUND);
    }))
  }

}
