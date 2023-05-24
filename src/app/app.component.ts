import { Component, NgZone, OnInit } from '@angular/core';
import { AppService } from './app.service';
import { LayoutService } from './layout.service';
import { VdsCityDistanceTemp, geometryDetails, sourDistDetails } from './model';
import { VdsCitiesDistance } from './layout/vds-cities/vds-cities.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'vds-gmap';

  value: any;

  auto: any;

  vdsCityDistance: VdsCityDistanceTemp[] = [];

  constructor(private ngZone: NgZone, private layout: LayoutService) {
    this.ngZone.runOutsideAngular(() => {
      this.startAutoUpdateTimeInterval();
      this.startGeometricCityTimeInterval();
    });
  }

  startAutoUpdateTimeInterval() {
    this.value = setInterval(() => {
      console.log('VDS City Distance Time Interval Started: ');
      this.getAutoUpdateCityDistance()
    }, 30000);
  }

  waitAutoUpdateTimeOut() {
    setTimeout(() => {
      console.log('Waiting to Start VDS City Distance Time Interval again: ')
      this.startAutoUpdateTimeInterval();
    }, 6000);
  }

  startGeometricCityTimeInterval() {
    this.auto = setInterval(() => {
      console.log('Geometric City Time Interval Started: ');
      this.callDetails('0', '200');
    }, 30000);
  }

  waitGeometricCityTimeOut() {
    setTimeout(() => {
      console.log('Waiting to Start Geometric City Time Interval again: ')
      this.startGeometricCityTimeInterval();
    }, 6000);
  }

  ngOnInit(): void { }


  getAutoUpdateCityDistance() {
    clearInterval(this.value);
    this.layout.autoUpdateCities('0', '500', 'Y').subscribe((data) => {
      console.log(data);
      if (data.length > 0 && Object.keys(data).length !== 0) {
        this.vdsCityDistance = data;
        this.processToUpdateCityDistance(this.vdsCityDistance, true);
      } else {
        this.waitAutoUpdateTimeOut();
      }
    }, error => {
      console.log(error)
      this.waitAutoUpdateTimeOut();
    });
  }

  processToUpdateCityDistance(dataSource: any, validate: boolean) {

    this.getAllSystemdistance(dataSource, validate).then((data) => {

      if (typeof (data) !== 'undefined' && data.length > 0) {
        if (validate) {
          console.log(data);
          this.autoCityDistance(data);
        } else {
          console.log(data);
          this.saveCityDistance(data);
        }
      }

    });
  }

  async getAllSystemdistance(data: any[], check: boolean): Promise<any[]> {

    let source: any[] = [];
    let destination: any[] = [];

    let details: any[] = [];

    let mode: string = google.maps.TravelMode.DRIVING;

    const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

    let len = 4;
    for (let i = 0; i < data.length; i++) {

      source = [];
      destination = [];

      if (check) {
        data.slice(i, len + 1).map((s) => {
          let v = new google.maps.LatLng(Number(s.sourceLatLng.split(',')[0]), Number(s.sourceLatLng.split(',')[1]));
          return source.push(v);
        });
        data.slice(i, len + 1).map((d) => {
          let v = new google.maps.LatLng(Number(d.destinationLatLng.split(',')[0]), Number(d.destinationLatLng.split(',')[1]));
          return destination.push(v);
        });
      } else {

        data.slice(i, len + 1).map((s) => {
          let v = new google.maps.LatLng(s.vdsCityGeolocations[0].latitude, s.vdsCityGeolocations[0].longtitude);
          return source.push(v);
        });
        data.slice(i, len + 1).map((d) => {
          let v = new google.maps.LatLng(d.vdsCityGeolocations[1].latitude, d.vdsCityGeolocations[1].longtitude);
          return destination.push(v);
        });

      }

      console.log("Index: " + i + " Length: " + (len + 1));
      console.log("Source: " + source + " " + " Destination: " + destination)

      let reqTempalte = {
        origins: source,
        destinations: destination,
        travelMode: mode,
        unitSystem: 0,
        avoidHighways: false,
        avoidTolls: false
      }

      console.log(reqTempalte);

      await this.layout.getGoogleMatricDistance(reqTempalte).then((d) =>
        d.subscribe((value) => {
          console.log(value);
          let output: VdsCityDistanceTemp = {} as VdsCityDistanceTemp;
          if (typeof (value) != 'undefined' && value.rows.length > 0) {
            value.rows.forEach((result: any, index: number) => {
              output = {
                cityDistId: data.slice(i, len + 1)[index].cityDistanceId,
                systemDistance: result.elements[index].status === 'OK' ? result.elements[index].distance.text : '',
                autoConfig: data.slice(i, len + 1)[index].autoConfig,
                nextUpdateDate: data.slice(i, len + 1)[index].updateProcess === '' ? '' : this.getNextUpdateDate(data.slice(i, len + 1)[index].updateProcess),
                updateProcess: data.slice(i, len + 1)[index].updateProcess,
                vdsCityGeolocations: typeof (data.slice(i, len + 1)[index].vdsCityGeolocations) === 'undefined' ? [] : data.slice(i, len + 1)[index].vdsCityGeolocations,
                destinationActualAddress: data.slice(i, len + 1)[index].destinationActualAddress,
                orginActualAddress: data.slice(i, len + 1)[index].orginActualAddress
              }

              details.push(output);

            })
          }

        }), error => {
          console.log(error.getErrorMessage());
          this.waitAutoUpdateTimeOut();
        });

      i = len;
      len = len + 5;
      console.log('Length:' + len);
      // await timer(6000); 
    }

    return Promise.resolve(details);


  }

  getNextUpdateDate(updateProcess: any): string | Date {

    let date: Date = new Date();

    if (updateProcess === 'D') {
      date.setDate(date.getDate() + 1);
    } else if (updateProcess === 'W') {
      date.setDate(date.getDate() + 7);
    } else if (updateProcess === 'M') {
      date.setMonth(date.getMonth() + 1);
    } else if (updateProcess === 'Y') {
      date.setFullYear(date.getFullYear() + 1);
    }
    console.log('Date: ' + date);

    return date.toISOString();

  }

  callDetails(page: string, size: string) {
    clearInterval(this.auto);
    this.layout.getDetails(page, size, 'N').subscribe(async (data) => {
      console.log(data);
      if (data != null && data.length > 0) {
        console.log(data);
        this.getSystemDistforSelectedRecords(data);
      }else {
        this.waitGeometricCityTimeOut();
      }
    }, error => { console.log(error); this.waitGeometricCityTimeOut(); });
  }

  async getSystemDistforSelectedRecords(value: any[]) {

    const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms))

    this.geolocationresultList = [];

    if (value.length > 0) {
      const timer = (ms: number | undefined) => new Promise(res => setTimeout(res, ms));
      for (let index = 0; index < value.length; index++) {
        this.geometricDetails = [];
        for (let j = 0; j < 2; j++) {
          let location: string = j == 0 ? value[index].sourceCity : value[index].destinationCity;
          j == 0 ? console.log('Source: ' + location) : console.log('Destination: ' + location);
          (await this.layout.getGeolocationService(value[index], { address: location + ',China' }, ((j == 0) ? 'S' : 'D'))).subscribe((e) => {
            this.updateGeometricDetails(value[index], e, ((j == 0) ? 'S' : 'D'), index);
            if (index === value.length - 1 && j == 1) {
              console.log(this.geolocationresultList);
              this.changeToProperTemplate(this.geolocationresultList);
            }
          }, error => { console.log(error); this.waitGeometricCityTimeOut(); })
        }
        // console.log("Waiting Time");
        // await timer(1000);
      };
    }

  }
  changeToProperTemplate(geolocationresultList: any[]) {

    let result: any[] = [];

    geolocationresultList.forEach((e) => {
      if (e.geolocationerrorMsg === '') {
        result.push({
          cityDistanceId: e.cityDistanceId,
          systemDistance: '',
          autoConfig: e.autoupdate ? 'Y' : 'N',
          nextUpdateDate: '',
          updateProcess: e.updateprocess,
          vdsCityGeolocations: e.geometricDetails,
          destinationActualAddress: '',
          orginActualAddress: ''
        })
      }
    });

    if (result.length > 0) {
      console.log(result)
      this.processToUpdateCityDistance(result, false);
    }
  }

  geolocationresultList: any[] = []
  geometricDetails: sourDistDetails[] = [];
  updateGeometricDetails(value: any, result: any, type: string, index: number) {

    try {
      if (!(result.charType === 'Failed')) {
        this.geometricDetails.push({
          latitude: result.response[0].geometry.location.lat(),
          longtitude: result.response[0].geometry.location.lng(),
          locationType: result.response[0].geometry.location_type,
          formattedAddress: result.response[0].formatted_address,
          country: result.response[0].address_components.find((s: any) => s.types.includes("country")).long_name,
          province: result.response[0].address_components.find((s: any) => s.types.includes("administrative_area_level_1"))?.long_name,
          locality: '',
          addrType: type,
          sourceChinese: result.charType !== '' && type === 'S' ? result.charType : '',
          destinationChinese: result.charType !== '' && type === 'D' ? result.charType : ''
        });
      } else {
        this.geometricDetails.push({} as sourDistDetails);
      }

      if (type === 'D') {
        let output = {
          positionId: index,
          cityDistanceId: value.cityDistanceId,
          sourceCity: value.sourceCity,
          destinationCity: value.destinationCity,
          sourceId: value.sourceId,
          destinationId: value.destinationId,
          manualdistance: value.distance + " km",
          systemdistance: '',
          systemduration: '',
          travelMode: google.maps.TravelMode.DRIVING,
          geometricDetails: this.geometricDetails,
          autoupdate: false,
          updateprocess: '',
          geolocationerrorMsg: (Object.keys(this.geometricDetails[0]).length === 0 && Object.keys(this.geometricDetails[1]).length === 0) ? 'Invalid Source & Destination Geolocation'
            : Object.keys(this.geometricDetails[0]).length === 0 ? 'Invalid Source Geolocation'
              : Object.keys(this.geometricDetails[1]).length === 0 ? 'Invalid Destination Geolocation' : '',
          distanceerrorMsg: ''
        }

        this.geolocationresultList.push(output);
      }
    } catch (error: unknown) {
      if(error instanceof Error){
        console.log(error)
      }
      this.waitGeometricCityTimeOut();
    }
  }


  autoCityDistance(result: VdsCityDistanceTemp[]) {
    this.layout.updateCityDistance(result).subscribe((value) => {
      console.log(value);
      this.waitAutoUpdateTimeOut();
    },error => {console.log(error); this.waitAutoUpdateTimeOut();});
  }

  saveCityDistance(result: VdsCityDistanceTemp[]) {
    this.layout.saveGeometricDetails(result).subscribe((value) => {
      console.log(value);
      this.waitGeometricCityTimeOut();
    },error => {console.log(error); this.waitGeometricCityTimeOut();});
  }





}
