import { AfterViewInit, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { catchError, map, pipe, startWith, switchMap } from "rxjs";
import { AppService } from "src/app/app.service";
import { LayoutService } from "src/app/layout.service";
import { DistanceCalcRequest, ViewCityDetails, ViewMapDetails, travelDeatils } from "src/app/model";

@Component({
    selector: 'vds-cities',
    templateUrl: './vds-cities.component.html',
    styleUrls: ['./vds-cities.component.scss']
})
export class VdsCitiesDistance implements OnInit, AfterViewInit {

    cityDetails: ViewCityDetails[] = [];

    dataSource = new MatTableDataSource<ViewCityDetails>(this.cityDetails);

    displayedColumns: string[] = ['Source', 'Destination', 'Manual Distance', 'System Distance'];

    @ViewChild(MatPaginator) paginator: MatPaginator = {} as MatPaginator

    constructor(private appservice: AppService, private layoutservice: LayoutService) { }

    ngOnInit(): void {

        this.callDetails();

    }


    callDetails() {

        let details: ViewCityDetails[] = []
        let ll = this.getdetails('/vdscitydistance/details').subscribe(async (data) => {
            console.log(data);
            if (data != null) {
                for (let i = 0; i < data.length; i++) {

                    let distance : any;
                    await this.getSystemdistance(data[i]).then((e)=>{
                        distance = e
                    });

                    console.log(distance);

                    let value: ViewCityDetails = {
                        sourceCity: data[i].sourceCity,
                        destinationCity: data[i].destinationCity,
                        sourceChineseName: data[i].sourceChineseName,
                        destinationChineseName: data[i].destinationChineseName,
                        manualdistance: data[i].distance,
                        systemdistance: distance
                    }

                    details.push(value);

                }
            }
            this.loadpage(details)

        });

    }

    loadpage(value: ViewCityDetails[]) {
        console.log(value)
        this.cityDetails = value;
        console.log(this.cityDetails)
        this.dataSource = new MatTableDataSource<ViewCityDetails>(this.cityDetails);
        this.dataSource.paginator = this.paginator;
    }

    async getSystemdistance(data:any){
        console.log(data)
        let source:string [] = [data.sourceCity];
        let destination:string [] = [data.destinationCity];

        console.log(source+" "+destination)
        

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
        data.subscribe((value)=>{
            console.log(value);
            distance = value.rows[0].elements[0].distance.text
        }))

        return distance;

    }



    onRowClick(even: any) {

    }

    ngAfterViewInit(): void {
    
    }

    getdetails(url: string) {
        return this.appservice.getResource(url);
    }
}
