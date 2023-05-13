import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, map, pipe, startWith, switchMap } from "rxjs";
import { AppService } from "src/app/app.service";
import { LayoutService } from "src/app/layout.service";
import { DistanceCalcRequest, ViewCityDetails, ViewMapDetails, travelDeatils } from "src/app/model";
import { ViewGmapComponent } from "../view-gmap/view-gmap.component";
import { NgxSpinnerService } from "ngx-spinner";

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

    details: ViewCityDetails[] = [];

    constructor(private appservice: AppService, private layoutservice: LayoutService, public gmapdialog: MatDialog, private spinner: NgxSpinnerService) { }

    ngOnInit(): void {

        this.callDetails('0', '20');

    }


    callDetails(page: string, size: string) {

        this.spinner.show();
        let ll = this.getdetails('/vdscitydistance/details?page=' + page + '&size=' + size).subscribe(async (data) => {
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
        this.spinner.hide();
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

        let source: string[] = [];
        let destination: string[] = [];

        let len = 9;
        for (let i = 0; i < data.length; i++) {

            source = [];
            destination = [];

            let checkProgess = true;

            data.slice(i, len+1).map((s) => { return source.push(s.sourceCity) });
            data.slice(i, len+1).map((d) => { return destination.push(d.destinationCity) });

            console.log("Index: " + i + " Length: " + (len+1));
            console.log("Source: " + source + " " + " Destination: " + destination)

            let reqTempalte = {
                origins: source,
                destinations: destination,
                travelMode: google.maps.TravelMode.DRIVING,
                unitSystem: 0,
                avoidHighways: false,
                avoidTolls: false
            }

            if (checkProgess) {
                checkProgess = false
                await this.layoutservice.getGoogleMatricDistance(reqTempalte).then((d) =>
                    d.subscribe((value) => {
                        console.log(value);
                        let output: ViewCityDetails = {} as ViewCityDetails;
                        value.rows.forEach((result: any, index: number) => {
                            output = {
                                positionId: index,
                                sourceCity: data.slice(i, len+1)[index].sourceCity,
                                destinationCity: data.slice(i, len+1)[index].destinationCity,
                                sourceChineseName: data.slice(i, len+1)[index].sourceChineseName,
                                destinationChineseName: data.slice(i, len+1)[index].destinationChineseName,
                                manualdistance: data.slice(i, len+1)[index].distance + " km",
                                systemdistance: result.elements[index].status === 'OK' ? result.elements[index].distance.text : "Failed",
                                systemduration: result.elements[index].status === 'OK' ? result.elements[index].duration.text : "Failed",
                                travelMode: google.maps.TravelMode.DRIVING
                            }

                            this.details.push(output);

                        })

                        checkProgess = true;

                    }));

                i = len;
                len = len + 10;
            }
        }

        this.loadpage(this.details);


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
                waypoints: []
            }
        }

        this.openDialog(this.recordDetails);

    }

    openDialog(view: any) {

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

    handlePage(event: PageEvent) {
        console.log(event);

    }

    getdetails(url: string) {
        return this.appservice.getResource(url);
    }
}
