import { Injectable } from '@angular/core';
import { travelDeatils } from './model';
import { Observable, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  travelDetails: travelDeatils[] = [];

  setTraveDetails(details: travelDeatils) {
    this.travelDetails.push(details);
  }

  getTravelDetails(): Observable<travelDeatils[]> {

    return of(this.travelDetails);
  }

  editTravelDetails(details: any) {
     return this.travelDetails.filter(data => data.positionId === details.positionId).forEach((e) => {
      e.source = details.source;
      e.destination = details.destination;
      e.distance = details.distance;
      e.duration= details.duration;
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

}
