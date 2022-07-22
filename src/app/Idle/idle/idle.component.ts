import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MatDialog } from "@angular/material/dialog";
import { Router } from '@angular/router';
import { IdleDialogComponent } from '../idle-dialog/idle-dialog.component';
import { Idle, DEFAULT_INTERRUPTSOURCES } from "@ng-idle/core";
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-idle',
  templateUrl: './idle.component.html',
  styleUrls: ['./idle.component.css']
})
export class IdleComponent implements OnInit {

  _dialogRef: MatDialogRef<IdleDialogComponent>;

  constructor(
    private _router: Router,
    private _dialog: MatDialog,
    private _userIdle: Idle,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      if (environment.feature.Idle.enable === false) {

        return;

      }
      // Activity Monitor settings
      this._userIdle.setIdle(environment.feature.Idle.idleTimeSeconds); // Executes when inactive for predefined interval
      this._userIdle.setTimeout(environment.feature.Idle.timeOutSeconds); // Executes a countdown prior to Timeout

      this._userIdle.onIdleStart.subscribe(() => {
        this._userIdle.clearInterrupts();
        this._dialogRef = this._dialog.open(IdleDialogComponent, {

          width: "600px",

          height: "293px",

          panelClass: "modalClass",

          disableClose: false,

          data: {

            title: "Your session is about to time out"

          }

        });

        this._dialogRef?.afterClosed().subscribe((action) => {

          if (action === "reset") {

            this.reset();

            return

          }

          if (action === "logout") {

            this.authService.logout();
            this._router.navigate(['/']);
          }

        });

      });



      this._userIdle.onIdleEnd.subscribe(() => {

        this._dialogRef?.close("reset");

      });



      this._userIdle.onTimeout.subscribe(() => {

        this._dialogRef?.close("logout");

      });
      this.reset();
    }
  }
  reset() {

    this._userIdle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this._userIdle.watch();

  }
}
