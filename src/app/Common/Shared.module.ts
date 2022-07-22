import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { SideFilterComponent } from './Components/side-filter/side-filter.component';
import { CommonModule } from '@angular/common';
import { AppearanceRoutingModule } from '../appearance/appearance-routing.module';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonFilterPipe } from './Pipe/common-filter.pipe';
import { TopFilterComponent } from './Components/top-filter/top-filter.component';
import { NgIdleModule } from '@ng-idle/core';
import { IdleDialogComponent } from '../Idle/idle-dialog/idle-dialog.component';
import { IdleComponent } from '../Idle/idle/idle.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MaterialModule } from './Material.module';
import { DateFormatPipe } from './Pipe/date-format.pipe';
import { SideFilterBEComponent } from './Components/side-filter-be/side-filter.component';

@NgModule({
  declarations: [
    SideFilterComponent,
    SideFilterBEComponent,
    CommonFilterPipe,
    TopFilterComponent,
    IdleComponent,
    IdleDialogComponent,
    DateFormatPipe
  ],
  imports: [
    CommonModule,
    AppearanceRoutingModule,
    NgxSliderModule,
    BrowserModule,
    NgbModule,
    NgxSliderModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgIdleModule,
    NgIdleModule.forRoot()
  ],
  exports:[SideFilterComponent,SideFilterBEComponent, TopFilterComponent, IdleComponent, IdleDialogComponent,DateFormatPipe],
  providers: [
   CommonFilterPipe
  ]
})
export class SharedModule { }
