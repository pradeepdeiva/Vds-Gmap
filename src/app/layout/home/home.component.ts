import { Component, ViewChild } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MatDialog } from '@angular/material/dialog';
import { DialogBox } from '../dialog-box/dialog-box.component';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete/ngx-google-places-autocomplete.directive';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { LayoutService } from 'src/app/layout.service';
import { DialogSetting, DistanceCalcRequest, travelDeatils } from 'src/app/model';
import { MatTableDataSource } from '@angular/material/table';
import { CityDistanceComponent } from 'src/app/layout/city-distance/city-distance.component';
import { MapDirectionsService } from '@angular/google-maps';
import { min } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('default', style({ transform: 'rotate(0)' })),
      state('rotated', style({ transform: 'rotate3d(0,1,0,180deg)' })),
      transition('rotated => default', animate('500ms ease-out')),
      transition('default => rotated', animate('500ms ease-in'))
    ])
  ]

})
export class HomeComponent {

  source: string = '';

  destination: string = '';

  state: string = 'default';

  checkSource: any

  selected: any = '1';

  dialog_box: DialogSetting = {
    picker: '',
    avoidToll: false,
    avoidHighways: false,
    combinedMode: false,
    waypoints: []
  }

  @ViewChild("sourcePlacesRef") sourceRef: GooglePlaceDirective | undefined;

  @ViewChild("destinationPlacesRef") destinationRef: GooglePlaceDirective | undefined;

  requestDetails: DistanceCalcRequest = {} as DistanceCalcRequest;

  data = new MatTableDataSource<any>([]);

  @ViewChild(CityDistanceComponent) child: CityDistanceComponent | undefined;

  count: number = 0;

  openDialog() {
    const dialogRef = this.dialog.open(DialogBox, {
      disableClose: true,
      data: {
        picker: this.dialog_box.picker, avoidToll: this.dialog_box.avoidToll, avoidHighways: this.dialog_box.avoidHighways,
        combinedMode: this.dialog_box.combinedMode, waypoints: this.dialog_box.waypoints
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${JSON.stringify(result)}`);
      this.dialog_box = result;
    });
  }

  constructor(public dialog: MatDialog, private layoutservice: LayoutService, private mapservice: MapDirectionsService) { }

  swapText() {
    this.state = (this.state === 'default') ? 'rotated' : 'default';
    if (this.source.length > 0 && this.destination.length > 0) {
      let temp = this.source;
      this.source = this.destination;
      this.destination = temp;
    }
  }



  handleAddressChange(event: Address, check: string) {
    console.log(event.formatted_address);

    if (check === 'source') {
      this.source = event.formatted_address;
    } else {
      this.destination = event.formatted_address;
    }

  }

  calculateDistance() {

    if (!this.dialog_box.combinedMode) {

      if (this.source.length > 0 && this.destination.length > 0 && this.selected.length > 0) {

        let sourceList: string[] = [this.source];

        let destinationList: string[] = [this.destination];

        let mode: string = (this.selected === '1') ? google.maps.TravelMode.DRIVING
          : (this.selected === '2') ? google.maps.TravelMode.WALKING : google.maps.TravelMode.BICYCLING;

        this.requestDetails = {
          origins: sourceList,
          destinations: destinationList,
          travelMode: mode,
          unitSystem: 0,
          avoidHighways: this.dialog_box.avoidHighways,
          avoidTolls: this.dialog_box.avoidToll,
          drivingOptions: {
            departureTime: new Date(this.dialog_box.picker),
            trafficModel: google.maps.TrafficModel.BEST_GUESS
          }
        }

        console.log(this.requestDetails);

        this.layoutservice.getGoogleMatricDistance(this.requestDetails).then((d) => {
          d.subscribe((results) => {
            console.log(results);

            for (let i = 0; i < results.rows.length; i++) {
              let distance = results.rows[i].elements[i].distance.text
              let duration = results.rows[i].elements[i].duration.text
              let orginAddress = results.originAddresses[i]
              let destinationAddress = results.destinationAddresses[i]

              let travelDeatils: travelDeatils = {
                positionId: this.count++,
                source: this.source,
                destination: this.destination,
                distance: distance,
                duration: duration,
                orginActualAddress: orginAddress,
                destinationActualAddress: destinationAddress,
                travelMode: mode,
                settings: this.dialog_box
              };


              this.layoutservice.setTraveDetails(travelDeatils);
              this.getDetails();
            }
          })
        });
      }
    } else {
      this.getCombinedDirectionReq();
    }

  }

  getDetails() {
    this.layoutservice.getTravelDetails().subscribe((d) => {
      this.data.data = d;
      console.log(d);
      this.child?.loadPage();
    })
  }

  getCombinedDirectionReq() {

    let mode: any = (this.selected === '1') ? google.maps.TravelMode.DRIVING
      : (this.selected === '2') ? google.maps.TravelMode.WALKING : google.maps.TravelMode.BICYCLING;

    if (this.source.length > 0 && this.destination.length > 0 && mode.length > 0 && this.dialog_box.combinedMode) {
      let directionReq = {
        origin: this.source,
        destination: this.destination,
        travelMode: mode,
        unitSystem: 0,
        waypoints: this.dialog_box.waypoints,
        avoidTolls: this.dialog_box.avoidToll,
        avoidHighways: this.dialog_box.avoidHighways
      };

      let result = this.mapservice.route(directionReq);

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
        let travelDeatils: travelDeatils = {
          positionId: this.count++,
          source: this.source,
          destination: this.destination,
          distance: totaldistance + ' Km',
          duration: duration_formatted,
          orginActualAddress: this.source,
          destinationActualAddress: this.destination,
          travelMode: mode,
          settings: this.dialog_box
        };

        this.layoutservice.setTraveDetails(travelDeatils);
        this.getDetails();

      })

    }

  }

}