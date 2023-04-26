import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { LayoutService } from "../layout.service";
import { HomeComponent } from "./home/home.component";
import { NavTabComponent } from "./nav-tab/nav-tab.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatMenuModule } from "@angular/material/menu";
import { MatTabsModule } from "@angular/material/tabs";
import { ButtonModule } from "primeng/button"
import { TabMenuModule } from "primeng/tabmenu"
import { LayoutRoutingModule } from "./layout-routing.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatNativeDateModule, MatOptionModule } from "@angular/material/core";
import { DropdownModule } from 'primeng/dropdown';
import { MatSelectModule } from "@angular/material/select";
import { CommonModule } from "@angular/common";
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from "@angular-material-components/datetime-picker";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { CdkListboxModule } from "@angular/cdk/listbox";
import { MatDialogModule } from "@angular/material/dialog";
import { DialogBox } from "./dialog-box/dialog-box.component";
import { GooglePlaceModule } from "ngx-google-places-autocomplete";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { CityDistanceComponent } from "./city-distance/city-distance.component";
import { GoogleMapsModule } from "@angular/google-maps";
import { ViewGmapComponent } from "./view-gmap/view-gmap.component";
import { SingleWayDistance } from "./single-way/single-way.component";
import { VdsCitiesDistance } from "./vds-cities/vds-cities.component";



@NgModule({
    declarations: [
        NavTabComponent,
        HomeComponent,
        DialogBox,
        CityDistanceComponent,
        SingleWayDistance,
        ViewGmapComponent,
        VdsCitiesDistance
    ],
    imports: [
        CommonModule,
        MatTableModule,
        LayoutRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        MatButtonModule,
        MatIconModule,
        MatSidenavModule,
        MatMenuModule,
        ButtonModule,
        TabMenuModule,
        MatTabsModule,
        MatInputModule,
        MatOptionModule,
        DropdownModule,
        MatOptionModule,
        MatSelectModule,
        MatFormFieldModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatCheckboxModule,
        NgxMatDatetimePickerModule,
        NgxMatTimepickerModule,
        NgxMatNativeDateModule,
        DragDropModule,
        CdkListboxModule,
        MatDialogModule,
        GooglePlaceModule,
        MatPaginatorModule,
        GoogleMapsModule
    ],
    providers: [LayoutService],
    exports: [],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class LayoutModule { }