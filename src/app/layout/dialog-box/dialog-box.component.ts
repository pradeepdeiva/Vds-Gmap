import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Inject } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
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

  datatimepicker: any;

  location: string = '';

  toppings: any = this._formBuilder.group({
    avoidtolls: false,
    avoidhighways: false,
    combinedorder: [false, Validators.required],
  });

  waypoints:google.maps.DirectionsWaypoint[] = [];

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.waypoints, event.previousIndex, event.currentIndex);
  }

  removeAll() {
    this.waypoints = []
  }

  addLocation() {
    if (this.location.length > 0) {
      this.waypoints.push({location: this.location,stopover:true});
      this.location = ''
    }
  }

  onNoClick(): void {

    let value = this.datatimepicker.value?.toString();

    this.data = {
      picker: value == undefined ? '' : value,
      avoidToll: this.toppings.value.avoidtolls,
      avoidHighways: this.toppings.value.avoidhighways,
      combinedMode: this.toppings.value.combinedorder,
      waypoints: this.toppings.value.combinedorder ? this.waypoints : []
    }

    this.dialogRef.close(this.data);
  }

}