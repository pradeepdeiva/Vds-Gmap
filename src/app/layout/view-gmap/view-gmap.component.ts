import { makeBindingParser } from '@angular/compiler';
import { Component, Inject } from '@angular/core';
import { MapDirectionsService } from '@angular/google-maps';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, map } from 'rxjs';
import { LayoutService } from 'src/app/layout.service';
import { DirectionRequest, ViewMapDetails, travelDeatils } from 'src/app/model';


@Component({
  selector: 'app-view-gmap',
  templateUrl: './view-gmap.component.html',
  styleUrls: ['./view-gmap.component.scss']
})
export class ViewGmapComponent {

  center: google.maps.LatLngLiteral = { lat: 20.5937, lng: 78.9629 };

  displayDirections: any = true;

  zoom = 14

  labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  labelIndex = 0;

  markerOptions: google.maps.MarkerOptions = {
    draggable: true,
    label: this.labels[this.labelIndex % this.labels.length]
  };

  marker: google.maps.Marker = {} as google.maps.Marker

  markerPositions: google.maps.LatLngLiteral[] = [];


  directionsRenderOption: {} = new google.maps.DirectionsRenderer({
    suppressMarkers: false, polylineOptions: {
      strokeColor: '#017411',
    }, draggable: true,
    markerOptions: {
      draggable: true,
      clickable: false,
    }
  });

  directionsResults$: Observable<google.maps.DirectionsResult | undefined> = {} as Observable<google.maps.DirectionsResult>;

  directions: any;

  editsource: string = '';

  editdestination: string = '';

  requestTemplate: DirectionRequest = {
    origin: '',
    destination: '',
    travelMode: '',
    unitSystem: 0,
    waypoints: [],
    avoidTolls: false,
    avoidHighways: false
  }

  editmode: boolean = true;

  viewdetails: ViewMapDetails = {} as ViewMapDetails;


  constructor(private mapservice: MapDirectionsService, private layservice: LayoutService,
    public dialogRef: MatDialogRef<ViewGmapComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data)

    this.requestTemplate = {
      origin: data.source,
      destination: data.destination,
      travelMode: data.travelMode,
      unitSystem: 0,
      waypoints: data.settings.waypoints,
      avoidTolls: data.settings.avoidToll,
      avoidHighways: data.settings.avoidHighways
    };

    this.viewdetails = {} as ViewMapDetails;

    console.log(this.requestTemplate);
    this.editsource = data.source;
    this.editdestination = data.destination;

    this.callRequest(this.requestTemplate, this.data.settings.combinedMode)
  }

  addMarker(event: google.maps.MapMouseEvent) {
    if (event.latLng != null) {
      this.markerPositions.push(event.latLng.toJSON())
      this.markerOptions.label = this.labels[this.labelIndex++ % this.labels.length];

      console.log(this.markerPositions)
    }

    if (this.markerPositions.length == 2) {

      let request = {
        origin: this.markerPositions[0],
        destination: this.markerPositions[1],
        travelMode: google.maps.TravelMode.DRIVING
      };

      this.callRequest(request, this.data.settings.combinedMode);

    }

  }

  setDirectionsOnDrag(event: any) {
    console.log("Triggered")
    console.log(event)
  }

  callRequest(request: any, checkmode: boolean) {
    this.markerPositions = [];
    console.log(request);

    if (!checkmode) {
      let value = this.mapservice.route(request);
      this.directionsResults$ = value.pipe(map(response => response.result));
      this.directionsResults$.subscribe((d) => {
        console.log(d)
        if (d?.routes[0] != null && !this.editmode) {
          this.viewdetails = {
            positionId: this.data.positionId,
            source: d?.routes[0].legs[0].start_address,
            destination: d?.routes[0].legs[0].end_address,
            distance: d?.routes[0].legs[0].distance != null ? d?.routes[0].legs[0].distance?.text : '',
            duration: d?.routes[0].legs[0].duration != null ? d?.routes[0].legs[0].duration?.text : '',
            travelMode: this.data.travelMode,
            settings: {
              picker: this.data.settings.picker,
              avoidToll: this.data.settings.avoidToll,
              avoidHighways: this.data.settings.avoidHighways,
              combinedMode: this.data.settings.combinedMode,
              waypoints: this.data.settings.waypoints
            }
          }
        }

      })
    }else {
      this.getCombinedModeDirection(request);
    }
  }

  getCombinedModeDirection(directionReq: any){

    let result = this.mapservice.route(directionReq);

    this.directionsResults$ = result.pipe(map(response => response.result));

    result.subscribe((value) => {
      console.log(value)
      let totaldistance = 0;
      let totalduration = 0;
      let waypoints = [];
      let duration_formatted: string = '';
      if (value.status === 'OK' && value.result?.routes[0] != null) {
        for (let i = 0; i < value.result.routes[0].legs.length; i++) {
          let dist = value.result.routes[0].legs[i].distance?.value ?? 0;
          totaldistance += dist;

          let dur = value.result.routes[0].legs[i].duration?.value ?? 0;
          totalduration += dur;

          if (!(i === value.result.routes[0].legs.length - 1)) {
            waypoints[i] = value.result.routes[0].legs[i].end_address;
          }
        }

        totaldistance = Math.round((totaldistance / 1000.0) * 10) / 10;

        console.log(`Total Distance: ${totaldistance}`);

        const duration = new Date(0, 0, 0, 0, 0, totalduration);
        if (duration.getHours() == 0) {
          duration_formatted = duration.getMinutes() + ' mins';
        } else
          duration_formatted = duration.getHours() + ' hours ' + duration.getMinutes() + ' mins';
      }
      console.log('Total duration:' + duration_formatted);

      console.log(`Waypoints: ${waypoints}`)
      this.viewdetails = {
        positionId: this.data.positionId,
        source: this.editsource,
        destination: this.editdestination,
        distance: totaldistance+ ' km',
        duration: duration_formatted,
        travelMode: this.data.travelMode,
        settings: {
          picker: this.data.settings.picker,
          avoidToll: this.data.settings.avoidToll,
          avoidHighways: this.data.settings.avoidHighways,
          combinedMode: this.data.settings.combinedMode,
          waypoints: this.data.settings.waypoints
        }
      }
    })

  }

  showDistance() {

    if (this.editsource.length > 0 && this.editdestination.length > 0) {
      let newRequest = {
        origin: this.editsource,
        destination: this.editdestination,
        travelMode: this.data.travelMode,
        unitSystem: 0,
        waypoints: this.data.settings.waypoints,
        avoidTolls: this.data.settings.avoidToll,
        avoidHighways: this.data.settings.avoidHighways
      };

      this.callRequest(newRequest, this.data.settings.combinedMode);

    }

  }

  changeMode() {
    this.editmode = this.editmode ? false : true;
    this.editsource = this.data.source;
    this.editdestination = this.data.destination;
    if (this.editmode) {
      this.viewdetails = {} as ViewMapDetails;
      this.callRequest(this.requestTemplate, this.data.settings.combinedMode);
    }else {
      this.viewdetails = {} as ViewMapDetails;
    }
  }

  saveCofirmList(): void {

    if (this.editmode) {
      this.dialogRef.close(this.data);
    } else {

      let editValue = this.layservice.editTravelDetails(this.viewdetails);

      console.log(editValue);

      this.dialogRef.close(this.viewdetails);
    }

  }


}
