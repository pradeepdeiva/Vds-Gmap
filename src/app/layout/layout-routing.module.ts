import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NavTabComponent } from "./nav-tab/nav-tab.component";
import { HomeComponent } from "./home/home.component";
import { CityDistanceComponent } from "./city-distance/city-distance.component";
import { SingleWayDistance } from "./single-way/single-way.component";
import { VdsCitiesDistance } from "./vds-cities/vds-cities.component";
import { CombinedWayComponent } from "./combined-way/combined-way.component";
import { AutoVdsCitiesComponent } from "./auto-vds-cities/auto-vds-cities.component";
import { LocationDetailsComponent } from "./location-details/location-details.component";

const routes: Routes = [{
    path: '', component: NavTabComponent, children: [
        { path: 'home', component: HomeComponent},
        { path: 'location', component: LocationDetailsComponent},
        { path: 'vdscities', component: VdsCitiesDistance},
        { path: 'autocities', component: AutoVdsCitiesComponent},

    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class LayoutRoutingModule { }