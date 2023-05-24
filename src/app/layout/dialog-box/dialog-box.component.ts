import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroupDirective, NgForm, Validators } from "@angular/forms";
import { ErrorStateMatcher } from "@angular/material/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Address } from "ngx-google-places-autocomplete/objects/address";
import { DialogSetting } from "src/app/model";

@Component({
  selector: 'dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBox {
  
  constructor(
    public dialogRef: MatDialogRef<DialogBox>,
    @Inject(MAT_DIALOG_DATA) public data: DialogSetting,
    private _formBuilder: FormBuilder) {
    console.log(data)

    this.datatimepicker = new FormControl(new Date(data.picker))

    this.toppings = this._formBuilder.group({
      avoidtolls: data.avoidToll,
      avoidhighways: data.avoidHighways,
      combinedorder: data.combinedMode,
    });

    this.waypoints = data.waypoints;

  }

  handleAddressChange(event: Address){
    if(event.formatted_address !== null && typeof(event.formatted_address) !== 'undefined'){
      this.location = event.formatted_address;
    }
  }

  getErrorMessage() {
    let depTime= this.datatimepicker.value?.toString();

    return (new Date(depTime) < new Date()) ? 'Greater Then Current Date & Time' : '';
  }

  datatimepicker: any;

  location: string = '';

  toppings: any = this._formBuilder.group({
    avoidtolls: false,
    avoidhighways: false,
    combinedorder: [false, Validators.required],
  });

  waypoints: google.maps.DirectionsWaypoint[] = [];

  validClck: boolean = true;

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.waypoints, event.previousIndex, event.currentIndex);
  }

  removeAll() {
    this.waypoints = []
  }

  addLocation() {
    if (this.location.length > 0 && this.waypoints.length < 5) {
      this.waypoints.push({ location: this.location, stopover: true });
      this.location = ''
    }
  }

  checkDate(event: any) {
    console.log(event)
    console.log(new Date(event).toISOString())
    if (new Date(event) < new Date()) {
      console.log('Depature Time should be greater')
      this.validClck = true
    } else {
      console.log('Depature Time Success')
    }
  }

  onNoClick(): void {

    let value = this.datatimepicker.value?.toString();

    this.data = {
      picker: value == undefined || value.includes('Invalid Date') ? '' : value,
      avoidToll: this.toppings.value.avoidtolls,
      avoidHighways: this.toppings.value.avoidhighways,
      combinedMode: this.toppings.value.combinedorder,
      waypoints: this.toppings.value.combinedorder ? this.waypoints : [],
      waylocations: []
    }

    this.dialogRef.close(this.data);
  }

}