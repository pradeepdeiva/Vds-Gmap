import { AfterViewInit, Component, Input, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { DialogSetting, ViewMapDetails, postReqTemp, travelDeatils } from '../../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LayoutService } from '../../layout.service';
import { ViewGmapComponent } from '../view-gmap/view-gmap.component';
import { MatDialog } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { ConfirmEventType, ConfirmationService } from 'primeng/api';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-city-distance',
  templateUrl: './city-distance.component.html',
  styleUrls: ['./city-distance.component.scss']
})
export class CityDistanceComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['source', 'destination', 'distance', 'duration'];

  @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator

  @Input() details = new MatTableDataSource<any>([]);

  dialog_result: any;

  recordDetails: ViewMapDetails = {} as ViewMapDetails;

  constructor(private layout: LayoutService, public gmapdialog: MatDialog, private messageSerivce: MessageService, private confirmDialog: ConfirmationService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void { }


  public loadPage() {
    this.details.paginator = this.paginator;
  }

  onRowClick(row: any) {

    this.recordDetails = {
      positionId: row.positionId,
      source: row.source,
      destination: row.destination,
      distance: row.distance,
      duration: row.duration,
      travelMode: row.travelMode,
      settings: row.settings,
      sourceLatLng: '',
      destinationLatLng: '',
      editmode: true
    }

    this.openDialog(this.recordDetails);
  }

  openDialog(value: any) {
    const dialogRef = this.gmapdialog.open(ViewGmapComponent, {
      disableClose: true,
      data: value,
      maxWidth: '95vw'
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      console.log(`Dialog result: ${JSON.stringify(result)}`);
      this.dialog_result = result;
    });
  }

  submitRecords() {

    this.spinner.show();
    let citydistance: postReqTemp[] = [];
    if (this.details.data.length > 0) {
      this.details.data.forEach((value) => {
        citydistance.push({
          source: value.source,
          destination: value.destination,
          distance: value.distance,
          duration: value.duration,
          travelMode: value.travelMode,
          geometricDetails: [value.sourceAddress, value.destinationAddress],
          autoCitySettings: {
            picker: (value.settings.picker.length > 1) ? new Date(value.settings.picker).toISOString() : '',
            avoidToll: value.settings.avoidToll,
            avoidHighways: value.settings.avoidHighways,
            combinedMode: value.settings.combinedMode,
            waypoints: value.settings.waypoints,
            waylocations: value.settings.waypoints.length > 0 ? this.getWaypoints(value.settings.waypoints) : [],
          },
          destinationActualAddress: value.destinationActualAddress,
          orginActualAddress: value.orginActualAddress,
          positionId: value.positionId
        })
      });

      console.log(citydistance);
      if (citydistance.length > 0)
        this.confirmationPopup(citydistance, 'Confirmation', 'Are sure want to be save Locaiton Details');
    }
  }
  getWaypoints(value: any): string[] {
    let waypoints: string[] = value.map((e:any)=>{return e.location})
    return waypoints;
  }

  confirmationPopup(citydistance: postReqTemp[], title: string, msg: string) {
    this.spinner.hide();
    this.confirmDialog.confirm({
      message: msg,
      header: title,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.spinner.show();
        this.saveLocationDetails(citydistance);
      },
      reject: (type: any) => {
        console.log(type)
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageSerivce.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  saveLocationDetails(citydistance: postReqTemp[]) {
    this.layout.saveTravelDetails(citydistance).subscribe((data) => {
      if (data.length > 0) {
        console.log("Save TravelDetails: " + JSON.stringify(data));
        this.messageSerivce.add({ severity: 'success', summary: 'Saved', detail: 'Successfully Stored', life: 5000, closable: true });
        this.clearTable();
        this.spinner.hide();
      }
    });
  }

  clearTable() {
    this.details.data = [];
    this.layout.travelDetails = [];
    sessionStorage.removeItem('travelDetails');
  }

  ngAfterViewInit(): void {

    this.details.paginator = this.paginator;

  }


}
