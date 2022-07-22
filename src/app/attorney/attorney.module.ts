import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AttorneyRoutingModule } from './attorney-routing.module';
import { AttorneyListComponent } from './attorney-list/attorney-list.component';
import { AttorneyCardComponent } from './attorney-card/attorney-card.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { AttorneyInfoComponent } from './attorney-info/attorney-info.component';
import { AttorneyViewComponent } from './attorney-view/attorney-view.component';
import { SharedModule } from '../Common/Shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';




@NgModule({
  declarations: [
    AttorneyListComponent,
    AttorneyCardComponent,
    AttorneyInfoComponent,
    AttorneyViewComponent
  ],
  imports: [
    CommonModule,
    AttorneyRoutingModule,
    CommonModule,
    NgxSliderModule,
    BrowserModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule
  ],
  
  providers: [DatePipe]
})
export class AttorneyModule { }
