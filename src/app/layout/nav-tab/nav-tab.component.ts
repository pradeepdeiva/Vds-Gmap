import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-nav-tab',
  templateUrl: './nav-tab.component.html',
  styleUrls: ['./nav-tab.component.scss']
})
export class NavTabComponent {

  items: { label: string, icon: string }[] = []


  activeItem: { label: string, icon: string } = {} as { label: string, icon: string };

  constructor(private appService: AppService,private router: Router){}

  ngOnInit() {
    this.items = [
      { label: 'Home', icon: 'pi pi-fw pi-home' },
      { label: 'SingeWay', icon: 'pi pi-code' },
      { label: 'CombinedWay', icon: 'pi pi-list' },
      { label: 'VDS Cities', icon: 'pi pi-window-minimize' },
    ];

    this.activeItem = this.items[0];

  }

  OnActiveItemChange(event:any){
    console.log("Triggered=> "+JSON.stringify(event.label)+" ==> "+event.label)
    if(event.label === 'Home'){
      this.router.navigate(['/home']);
    }else if(event.label === 'SingeWay') {
      this.router.navigate(['/singleway']);
    }else if(event.label === 'CombinedWay'){
      this.router.navigate(['/combinedway']);
    }else if(event.label === 'VDS Cities'){
      this.router.navigate(['/vdscities']);
    }
  }


  logout(){
    this.appService.logout();
  }

}
