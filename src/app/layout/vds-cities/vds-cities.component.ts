import { AfterViewInit, Component, NgZone, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator, PageEvent } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, catchError, map, of, pipe, retry, startWith, switchMap } from "rxjs";
import { AppService } from "src/app/app.service";
import { LayoutService } from "src/app/layout.service";
import { DialogSetting, DistanceCalcRequest, VdsCityDistanceTemp, ViewCityDetails, ViewMapDetails, postReqTemp, sourDistDetails, travelDeatils } from "src/app/model";
import { ViewGmapComponent } from "../view-gmap/view-gmap.component";
import { NgxSpinnerService } from "ngx-spinner";
import { ConfirmEventType, ConfirmationService, MessageService } from "primeng/api";

@Component({
    selector: 'vds-cities',
    templateUrl: './vds-cities.component.html',
    styleUrls: ['./vds-cities.component.scss']
})
export class VdsCitiesDistance implements OnInit, AfterViewInit {

    cityDetails: any[] = [];

    dataSource: MatTableDataSource<ViewCityDetails> = new MatTableDataSource<ViewCityDetails>();

    displayedColumns: string[] = ['Source', 'Destination', 'System Distance', 'Auto Update'];

    @ViewChild('paginator') paginator!: MatPaginator;

    recordDetails: ViewMapDetails = {} as ViewMapDetails;

    dialog_result: any;

    details: ViewCityDetails[] = [];

    allDetails: any[] = [];

    countries: any[] = [];

    states: any[] = [];

    selectedCountry: any = 'null';

    selectedStates: any = null;

    selected: any = '1';

    selectedValue: any = '1';

    selectAllToggle: boolean = false;

    value: any;

    selectoption: any = 'D';

    constructor(private appservice: AppService, private layoutservice: LayoutService, public gmapdialog: MatDialog, private spinner: NgxSpinnerService,
        private confirmationService: ConfirmationService, private messageService: MessageService) { }

    ngOnInit(): void {

        this.spinner.show();
        this.getAllCountry();
    }

    selectUpdateProcess(value: any, event: any, check: string) {

        if (check === 'Toggle') {
            this.dataSource.data.forEach((e) => {
                if (e.cityDistanceId == value.cityDistanceId) {
                    e.autoupdate = event.source.checked;
                    e.updateProcess = e.autoupdate ? 'D' : '';
                    e.autoConfig = e.autoupdate ? 'Y' : 'N';
                }
            })
        } else if (check === 'DropDown') {
            this.dataSource.data.forEach((e) => {
                if (e.cityDistanceId == value.cityDistanceId) {
                    if (event.value !== '') {
                        e.updateProcess = event.value;
                    } else {
                        e.updateProcess = event.value;
                        e.autoupdate = false;
                        e.autoConfig = e.autoupdate ? 'Y' : 'N';
                    }
                }
            })
        }
    }

    selectAllTogglefunction(event: any, check: string) {

        if (check === 'Toggle') {
            this.selectAllToggle = event.checked
            this.dataSource.data.forEach((e) => {
                e.autoupdate = event.checked
                e.updateProcess = e.autoupdate ? 'D' : '';
                e.autoConfig = e.autoupdate ? 'Y' : 'N';
            });
        } else if (check === 'DropDown') {
            this.selectAllToggle = event.value === '' ? false : true;
            this.dataSource.data.forEach((e) => {
                e.updateProcess = event.value;
                e.autoupdate = event.value === '' ? false : true
                e.autoConfig = e.autoupdate ? 'Y' : 'N';
            });
        }
    }

    getAllCountry() {

        this.layoutservice.getCountry().subscribe((value) => {
            this.allDetails = value.data
            this.countries = value.data
        }, error => { console.log(error); this.spinner.hide() });

        this.spinner.hide();

    }

    onChange(event: any) {
        console.log(event.value)
        if (event.value != null) {
            if (event.value.name === 'China') {
                this.spinner.show();
                this.layoutservice.getStateDetails(event.value.name).subscribe((d) => {
                    if (d.length > 0) {
                        console.log(d);
                        d.forEach((value: string) => { this.states.push({ name: value }) });
                        console.log(this.states);
                        this.spinner.hide();
                    }
                });
            } else {
                this.states = event.value.states.map((d: any) => { return d });
            }
        } else {
            this.selectedStates = null;
            this.selectedCountry = null;
            this.states = [];
        }
    }

    searchVdsCity() {

        this.spinner.show();
        if (this.selectedCountry != null || this.selectedStates != null) {
            this.dataSource.data = [];
            this.cityDetails = [];
            this.layoutservice.vdscityDetails = [];
            sessionStorage.removeItem('vdscitydetails');
            this.layoutservice.getCityDetaial(this.selectedCountry.name, this.selectedStates === null ? null : this.selectedStates.name).subscribe((data) => {
                this.getSystemDistforSelectedRecords(data);

            });
        } else {
            this.spinner.hide();
            this.messageService.add({
                severity: 'warn', summary: 'No Records', detail: 'Nothing Found to Display',
                life: 5000, closable: true
            });
        }
    }

    getSystemDistforSelectedRecords(value: any[]) {

        if (value.length > 0 && !(this.dataSource.data.length > 0)) {
            value.forEach((d) => { this.layoutservice.setVdsCityDetails(d) });
            this.loadpage(value);
        } else {
            this.spinner.hide();
        }
    }

    loadpage(value: ViewCityDetails[]) {
        this.dataSource.data = value;
        console.log(this.dataSource.data);
        setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
        }, 200);
    }

    onRowClick(row: any) {

        console.log(row);

        this.recordDetails = {
            positionId: row.cityDistanceId,
            source: row.sourceCity,
            destination: row.destinationCity,
            distance: row.distance,
            duration: '',
            travelMode: 'DRIVING',
            settings: {
                avoidToll: false,
                avoidHighways: false,
                combinedMode: false,
                picker: '',
                waypoints: [],
                waylocations: []
            },
            sourceLatLng: row.sourceLatLng,
            destinationLatLng: row.destinationLatLng,
            editmode: false
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
        this.dataSource.paginator = this.paginator;
    }

    handlePage(event: PageEvent) {
        console.log(event);

    }

    submitRecords() {

        this.spinner.show();
        if (this.dataSource.data.length > 0) {
            let value: ViewCityDetails[] = [];
            this.layoutservice.getVdsCityDetails().subscribe((d) => value = d);
            const differenceCount = this.dataSource.data.filter(itemA => {
                const matchingItemB: any = value.find(itemB => itemB.cityDistanceId === itemA.cityDistanceId);
                return matchingItemB.updateProcess !== itemA.updateProcess;
            });
            console.log(differenceCount.length);
            let totalCount = this.dataSource.data.length;
            if (differenceCount.length > 0) {
                this.confirmDialogBox(differenceCount, `${differenceCount.length} Records Changed out of ${totalCount}`, 'Confirmation', true);
            } else {
                this.spinner.hide();
                this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Nothing found new to Update' });
            }
        }
    }

    clearTable() {
        sessionStorage.removeItem('vdscitydetails');
        this.dataSource.data = [];
        this.layoutservice.vdscityDetails = [];
    }

    confirmDialogBox(result: any, title: string, msg: string, check: boolean) {

        this.spinner.hide();
        this.confirmationService.confirm({
            message: title,
            header: msg,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                console.log(result)
                if (check) {
                    console.log(result);
                    this.spinner.show();
                    this.changeFormatToCityDistTemp(result);
                }
            },
            reject: (type: any) => {
                console.log(type)
                switch (type) {
                    case ConfirmEventType.REJECT:
                        this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
                        break;
                }
            }
        });
    }

    changeFormatToCityDistTemp(result: any) {

        let value: VdsCityDistanceTemp[] = [];

        result.forEach((e: any) => {
            value.push({
                cityDistId: e.cityDistanceId,
                systemDistance: e.distance,
                autoConfig: e.autoConfig,
                nextUpdateDate: e.updateProcess === '' ? '' : this.getNextUpdateDate(e.updateProcess),
                updateProcess: e.updateProcess,
                vdsCityGeolocations: [],
                destinationActualAddress: "",
                orginActualAddress: ""
            })
        })

        console.log(value);
        if (value.length > 0) {
            this.layoutservice.saveCityDistance(value).subscribe((d) => {
                console.log(d);
                this.messageService.add({ severity: 'success', summary: 'Confirmed', detail: 'Saved Successfully', life: 5000, closable: true });
                this.searchVdsCity();
                this.spinner.hide();
            })
        }
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

}
