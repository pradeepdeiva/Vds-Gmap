import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { LayoutService } from 'src/app/layout.service';
import { DialogBox } from '../dialog-box/dialog-box.component';
import { DialogSetting, ViewMapDetails } from 'src/app/model';
import { ViewGmapComponent } from '../view-gmap/view-gmap.component';

@Component({
  selector: 'app-location-details',
  templateUrl: './location-details.component.html',
  styleUrls: ['./location-details.component.scss']
})
export class LocationDetailsComponent implements OnInit {

  displayedColumns: string[] = ['source', 'destination', 'distance', 'duration'];

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator

  details = new MatTableDataSource<any>([]);

  dialog_box: ViewMapDetails = {} as ViewMapDetails;

  constructor(private layout: LayoutService, public gmapdialog: MatDialog, private spinner: NgxSpinnerService, public dialog: MatDialog) { }


  ngOnInit(): void {
    this.load();
  }

  load() {
    this.spinner.show();
    this.layout.getLocationDetails().subscribe((d) => {
      this.loadPage(d);
    });

  }

  loadPage(data: any) {
    console.log(data);
    this.details.data = data;
    setTimeout(() => {
      this.details.paginator = this.paginator;
      this.spinner.hide();
    }, 200);
  }

  onRowClick(row: any) {

    this.dialog_box = {
      positionId: row.sysCityID,
      source: row.source,
      destination: row.destination,
      distance: row.distance,
      duration: row.duration,
      travelMode: row.travelMode,
      settings: {
        picker: row.autoCitySettings.picker,
        avoidToll: (row.autoCitySettings.avoidToll === 'true'),
        avoidHighways: (row.autoCitySettings.avoidHighways === 'true'),
        combinedMode: (row.autoCitySettings.combinedMode === 'true'),
        waypoints: row.autoCitySettings.combinedPoints === null ? [] : this.getWapointsFormat(row.autoCitySettings.combinedPoints),
        waylocations: row.autoCitySettings.combinedPoints === null ? [] : row.autoCitySettings.combinedPoints.split(','),
      },
      sourceLatLng: '',
      destinationLatLng: '',
      editmode: false
    }

    this.openDialog(this.dialog_box);
  }

  getWapointsFormat(combinedpoints: string): google.maps.DirectionsWaypoint[] {

    let value = combinedpoints.split('~');
    let result : google.maps.DirectionsWaypoint[] = []
    value.forEach((v)=>{
      result.push({location:v,stopover:true});
    })
    return result
  }

  openDialog(result: any) {
    const dialogRef = this.dialog.open(ViewGmapComponent, {
      disableClose: true,
      data: result,
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${JSON.stringify(result)}`);
      this.dialog_box = result;
    });
  }



}
