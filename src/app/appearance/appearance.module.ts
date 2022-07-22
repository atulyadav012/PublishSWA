import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AppearanceRoutingModule } from './appearance-routing.module';
import { AppearanceCardComponent } from './appearance-card/appearance-card.component';
import { AppearanceEntryComponent } from './appearance-entry/appearance-entry.component';
import { AppearanceListComponent } from './appearance-list/appearance-list.component';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppearanceDocComponent } from './appearance-doc/appearance-doc.component';
import { AppearanceViewComponent } from './appearance-view/appearance-view.component';
import { AppearanceInfoComponent } from './appearance-info/appearance-info.component';
import { CancelAppearanceComponent } from './cancel-appearance/cancel-appearance.component';
import { ApplyAppearanceComponent } from './apply-appearance/apply-appearance.component';
import { ApplicationListComponent } from './application-list/application-list.component';
import { ApplicationCardComponent } from './application-card/application-card.component';
import { SharedModule } from '../Common/Shared.module';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DateFormatPipe } from '../Common/Pipe/date-format.pipe';
import { AppearanceListBEComponent } from './appearance-list-be/appearance-list.component';
// import {NgxPaginationModule} from 'ngx-pagination'
@NgModule({
  declarations: [
    AppearanceCardComponent,
    AppearanceEntryComponent,
    AppearanceListComponent,
    AppearanceListBEComponent,
    AppearanceDocComponent,
    AppearanceViewComponent,
    AppearanceInfoComponent,
    CancelAppearanceComponent,
    ApplyAppearanceComponent,
    ApplicationListComponent,
    ApplicationCardComponent,
    //DateFormatPipe
  ],
  imports: [
    CommonModule,
    SharedModule,
    AppearanceRoutingModule,
    NgxSliderModule,
    BrowserModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    //DateFormatPipe
    // NgxPaginationModule
  ],
  
  providers: [DatePipe, NgbModule]
})
export class AppearanceModule { }
