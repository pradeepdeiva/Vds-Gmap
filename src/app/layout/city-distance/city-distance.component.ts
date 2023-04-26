import { AfterViewInit, Component, Input, IterableDiffers, OnInit, ViewChild } from '@angular/core';
import { DialogSetting, ViewMapDetails, travelDeatils } from '../../model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { LayoutService } from '../../layout.service';
import { ViewGmapComponent } from '../view-gmap/view-gmap.component';
import { MatDialog } from '@angular/material/dialog';

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

  constructor(private layout: LayoutService, public gmapdialog: MatDialog) { }

  ngOnInit(): void { }


  public loadPage() {
    this.details.paginator = this.paginator;
  }

  onRowClick(row: any) {
    console.log(row);

    this.recordDetails = {
      positionId: row.positionId,
      source: row.source,
      destination: row.destination,
      distance: row.distance,
      duration: row.duration,
      travelMode: row.travelMode,
      settings: row.settings
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

  ngAfterViewInit(): void {

    this.details.paginator = this.paginator;

  }


}
