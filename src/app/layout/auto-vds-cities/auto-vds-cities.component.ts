import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { MessageService } from 'primeng/api';
import { LayoutService } from 'src/app/layout.service';
import { AutoVdsCityDetails } from 'src/app/model';

@Component({
  selector: 'app-auto-vds-cities',
  templateUrl: './auto-vds-cities.component.html',
  styleUrls: ['./auto-vds-cities.component.scss']
})
export class AutoVdsCitiesComponent implements OnInit, OnDestroy {

  cityDetails: AutoVdsCityDetails[] = [];
  dataSource: MatTableDataSource<AutoVdsCityDetails> = new MatTableDataSource<AutoVdsCityDetails>(this.cityDetails);


  displayedColumns: string[] = ['Source', 'Destination', 'Manual Distance'];

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(private layout: LayoutService, private spinner: NgxSpinnerService, private msgService: MessageService) { }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.spinner.show();
    this.layout.autoCityDetails = [];
    this.layout.getDetails('0', '5000', 'N').subscribe((value) => {
      this.loadDetails(value);
    }, error => { console.log(error); this.spinner.hide(); });
  }

  loadDetails(value: any) {

    if (value.length > 0) {
      value.forEach((d: AutoVdsCityDetails) => {
        let output: AutoVdsCityDetails = d
        this.layout.setAutoVdsCityDetails(output);
      });

      if (this.layout.autoCityDetails.length > 0) {
        this.layout.getAutoVdsCityDetails().subscribe((d) => {
          this.cityDetails = d;
          this.dataSource = new MatTableDataSource<AutoVdsCityDetails>(this.cityDetails);
          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.spinner.hide();
          }, 500);
        })
      }
    } else {
      this.spinner.hide();
      this.msgService.add({
        severity: 'warn', summary: 'No Records', detail: 'Nothing Found to Display',
        life: 5000, closable: true
      });
    }
  }


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy(): void {
    this.msgService.clear();
  }


}
