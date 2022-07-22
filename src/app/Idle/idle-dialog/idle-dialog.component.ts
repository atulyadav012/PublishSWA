import { Component, OnInit, Inject, OnDestroy } from "@angular/core";

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

import { Idle } from "@ng-idle/core";

import { Subscription } from "rxjs";


@Component({
  selector: 'app-idle-dialog',
  templateUrl: './idle-dialog.component.html',
  styleUrls: ['./idle-dialog.component.scss']
})

export class IdleDialogComponent implements OnInit,OnDestroy  {

  idleState = "";

  partnerName = "T-Mobile";

  isPatner = false;

  private _onTimeoutWarning$: Subscription;
  constructor(

    private _userIdle: Idle,

    private _dialogRef: MatDialogRef<IdleDialogComponent>,

    @Inject(MAT_DIALOG_DATA) public data: DialogData

  ) { }

 

  ngOnInit(): void {

    this._onTimeoutWarning$ = this._userIdle.onTimeoutWarning.subscribe(

      (countdown) => {

        this.idleState = `in: ${countdown}`;

        if (countdown <= 1) {

          this._dialogRef?.close("logout");

        }

      }

    );

  }

 

  ngOnDestroy(): void {

    this._onTimeoutWarning$?.unsubscribe();

  }

 

  closeDialog(): void {

    this._dialogRef?.close("reset");

  }

 

  confirmDialog() {

    this._dialogRef?.close("logout");

  }


}

export interface DialogData {

  title: string;

  modalID: string;

  message?: string;

}