import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, map, pipe, startWith, switchMap } from "rxjs";
import { AppService } from "src/app/app.service";
import { LayoutService } from "src/app/layout.service";
import { DistanceCalcRequest, ViewCityDetails, ViewMapDetails, travelDeatils } from "src/app/model";
import { ViewGmapComponent } from "../view-gmap/view-gmap.component";

@Component({
    selector: 'vds-cities',
    templateUrl: './vds-cities.component.html',
    styleUrls: ['./vds-cities.component.scss']
})
export class VdsCitiesDistance implements OnInit, AfterViewInit {

    cityDetails: ViewCityDetails[] = [];

    dataSource = new MatTableDataSource<ViewCityDetails>(this.cityDetails);

    displayedColumns: string[] = ['Source', 'Destination', 'Manual Distance', 'System Distance'];

    @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator;

    recordDetails: ViewMapDetails = {} as ViewMapDetails;

    dialog_result: any;

    constructor(private appservice: AppService, private layoutservice: LayoutService,public gmapdialog: MatDialog) { }

    ngOnInit(): void {

        this.callDetails();

    }


    callDetails() {

        let ll = this.getdetails('/vdscitydistance/details').subscribe(async (data) => {
            console.log(data);
            if (data != null) {
                this.getAllSystemdistance(data);
            }

        });
    }

    loadpage(value: ViewCityDetails[]) {
        console.log(value)
        this.cityDetails = value;
        console.log(this.cityDetails)
        this.dataSource = new MatTableDataSource<ViewCityDetails>(this.cityDetails);
        this.dataSource.paginator = this.paginator;
    }

    async getSystemdistance(data: any) {
        console.log(data)
        let source: string[] = [data.sourceCity];
        let destination: string[] = [data.destinationCity];

        console.log(source + " " + destination)


        let reqTempalte = {
            origins: source,
            destinations: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: 0,
            avoidHighways: false,
            avoidTolls: false
        }

        let distance = '';
        await this.layoutservice.getGoogleMatricDistance(reqTempalte).then((data) =>
            data.subscribe((value) => {
                console.log(value);
                distance = value.rows[0].elements[0].distance.text
            }))

        return distance;

    }

    async getAllSystemdistance(data: any[]) {

        let details: ViewCityDetails[] = [];
        let source: string[] = [];
        let destination: string[] = [];

        data.forEach((s) => { source.push(s.sourceCity) });
        data.forEach((d) => { destination.push(d.destinationCity) });


        let reqTempalte = {
            origins: source,
            destinations: destination,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: 0,
            avoidHighways: false,
            avoidTolls: false
        }

        await this.layoutservice.getGoogleMatricDistance(reqTempalte).then((d) =>
            d.subscribe((value) => {
                console.log(value);
                let output: ViewCityDetails = {} as ViewCityDetails;
                value.rows.forEach((result: any, index: number) => {
                    output = {
                        positionId: index,
                        sourceCity: data[index].sourceCity,
                        destinationCity: data[index].destinationCity,
                        sourceChineseName: data[index].sourceChineseName,
                        destinationChineseName: data[index].destinationChineseName,
                        manualdistance: data[index].distance + " km",
                        systemdistance: result.elements[index].distance.text,
                        systemduration: result.elements[index].duration.text,
                        travelMode: google.maps.TravelMode.DRIVING
                    }

                    details.push(output);

                })

            }))

        this.loadpage(details);


    }



    onRowClick(row: any) {

        console.log(row);

        this.recordDetails = {
            positionId: row.positionId,
            source: row.sourceCity,
            destination: row.destinationCity,
            distance: row.systemdistance,
            duration: row.systemduration,
            travelMode: row.travelMode,
            settings: {
                avoidToll: false,
                avoidHighways: false,
                combinedMode: false,
                picker: '',
                waypoints:[]
            }
          }
      
          this.openDialog(this.recordDetails);

    }

    openDialog(view:any){

        const dialogRef = this.gmapdialog.open(ViewGmapComponent, {
            disableClose: true,
            data: view,
            maxWidth: '95vw'
          });
      
          dialogRef.afterClosed().subscribe((result: any) => {
            console.log(`Dialog result: ${JSON.stringify(result)}`);
            this.dialog_result = result;
          });


    }

    ngAfterViewInit(): void {

    }

    getdetails(url: string) {
        return this.appservice.getResource(url);
    }
}
