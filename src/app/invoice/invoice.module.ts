import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InvoiceRoutingModule } from './invoice-routing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { BrowserModule } from '@angular/platform-browser';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InvoiceCardComponent } from './invoice-card/invoice-card.component';
import { InvoiceEntryComponent } from './invoice-entry/invoice-entry.component';
import { InvocieListComponent } from './invocie-list/invocie-list.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SharedModule } from '../Common/Shared.module';
import { RateComponent } from './rate/rate.component';
import { InvoiceViewComponent } from './invoice-view/invoice-view.component';

@NgModule({
  declarations: [InvoiceCardComponent, InvoiceEntryComponent,InvoiceViewComponent, InvocieListComponent, RateComponent],
  imports: [
    CommonModule,
    SharedModule,
    InvoiceRoutingModule,
    NgxSliderModule,
    BrowserModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    NgxSpinnerModule,
    ReactiveFormsModule
  ],
  providers:[NgbActiveModal]
})
export class InvoiceModule { }
