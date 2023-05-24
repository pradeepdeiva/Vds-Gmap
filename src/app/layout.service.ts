import { Injectable, NgZone } from '@angular/core';
import { AutoVdsCityDetails, VdsCityDistanceTemp, ViewCityDetails, postReqTemp, sourDistDetails, travelDeatils } from './model';
import { Observable, map, of } from 'rxjs';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(private appserive: AppService) { }

  travelDetails: travelDeatils[] = [];

  vdscityDetails: ViewCityDetails[] = [];

  autoCityDetails: AutoVdsCityDetails[] = [];

  value: any;

  setTraveDetails(details: travelDeatils) {
    console.log(details)
    this.travelDetails.push(details);
    sessionStorage.setItem('travelDetails', JSON.stringify(this.travelDetails))
  }

  getTravelDetails(): Observable<travelDeatils[]> {

    let value = JSON.parse(sessionStorage.getItem('travelDetails') || '[]')
    this.travelDetails = value;
    return of(this.travelDetails);
  }

  setVdsCityDetails(details: ViewCityDetails) {
    this.vdscityDetails.push(details);
    sessionStorage.setItem('vdscitydetails', JSON.stringify(this.vdscityDetails))
  }

  getVdsCityDetails(): Observable<ViewCityDetails[]> {
    let value = JSON.parse(sessionStorage.getItem('vdscitydetails') || '[]')
    this.vdscityDetails = value;
    return of(this.vdscityDetails);
  }

  setAutoVdsCityDetails(details: AutoVdsCityDetails) {
    this.autoCityDetails.push(details);
  }

  getAutoVdsCityDetails(): Observable<AutoVdsCityDetails[]> {
    return of(this.autoCityDetails);
  }

  editTravelDetails(details: any) {
    return this.travelDetails.filter(data => data.positionId === details.positionId).forEach((e) => {
      e.source = details.source;
      e.destination = details.destination;
      e.distance = details.distance;
      e.duration = details.duration;
    })
  }

  async getGoogleMatricDistance(request: any): Promise<Observable<any>> {

    let service = new google.maps.DistanceMatrixService();

    let output: any;

    await service.getDistanceMatrix(request, (result: any, status) => {
      if (status === 'OK') {
        output = result;
      }
    }).catch((error) => { console.log(error) })

    return of(output);

  }

  async getGeolocationService(value: any, req: any, type: string): Promise<Observable<any>> {

    let service = new google.maps.Geocoder();

    let output: {
      response?: google.maps.GeocoderResponse,
      charType: string
    } = {} as any

    await service.geocode(req, (result: any, status) => {
      if (status === 'OK') {
        console.log(result);
        output = {
          response: result,
          charType: ''
        }
      }
    }).catch(async (error) => {
      let location = type === 'S' ? value.sourceChinese : value.destinationChinese;
      await service.geocode({ address: location + ',China' }, (result: any, status) => {
        if (status === 'OK') {
          console.log(result);
          output = {
            response: result,
            charType: location
          }
        }
      }).catch((error) => {
        console.log(error)
        output = {
          response: undefined,
          charType: 'Failed'
        }
      })

    })

    return of(output);

  }

  saveTravelDetails(travelDeatils: postReqTemp[]) {
    return this.appserive.postResource('/automatic/save', travelDeatils);
  }

  autoUpdateCities(page: string, size: string, process: string) {
    return this.appserive.getResource('/vdscitydistance/details?page=' + page + '&size=' + size + '&process=' + process);
  }

  updateCityDistance(data: VdsCityDistanceTemp[]) {
    return this.appserive.putMapping('/vdscitydistance/update', data);
  }

  getDetails(page: string, size: string, process: string) {
    return this.appserive.getResource('/vdscitydistance/details?page=' + page + '&size=' + size + '&process=' + process);
  }

  saveGeometricDetails(result: VdsCityDistanceTemp[]) {
    return this.appserive.postResource('/vdscitydistance/save', result);
  }

  getCityDetaial(selectedCountry: string, selectedStates: string) {
    return this.appserive.getResource('/vdscitydistance/citydetails?country=' + selectedCountry + '&province=' + selectedStates);
  }

  getCountry() {
    return this.appserive.getOutsideResource('https://countriesnow.space/api/v0.1/countries/states');
  }

  saveCityDistance(result: VdsCityDistanceTemp[]) {
    return this.appserive.postResource('/vdscitydistance/save',result);
  }

  getStateDetails(name: any) {
    return this.appserive.getResource('/vdsgeolocation/details?country='+name);
}

getLocationDetails() {
  return this.appserive.getResource('/automatic/cities');
}


}
