import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { NavTabComponent } from "./nav-tab/nav-tab.component";
import { HomeComponent } from "./home/home.component";
import { CityDistanceComponent } from "./city-distance/city-distance.component";
import { SingleWayDistance } from "./single-way/single-way.component";
import { VdsCitiesDistance } from "./vds-cities/vds-cities.component";
import { CombinedWayComponent } from "./combined-way/combined-way.component";

const routes: Routes = [{
    path: '', component: NavTabComponent, children: [
        { path: 'home', component: HomeComponent},
        { path: 'singleway', component: SingleWayDistance},
        { path: 'combinedway', component: CombinedWayComponent},
        { path: 'vdscities', component: VdsCitiesDistance},

    ]
}]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})


export class LayoutRoutingModule { }