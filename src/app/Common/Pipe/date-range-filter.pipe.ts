import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateRangeFilter'
})
export class DateRangeFilterPipe implements PipeTransform {

  transform(items: any[], DateFrom: string, DateTo: string, fieldName: string, calledFor: string, profileType: string) {

    if (items && items.length) {
      var datePipe = new DatePipe("en-US");
      DateFrom = DateFrom != null ? datePipe.transform(DateFrom, 'yyyy-MM-dd') || '' : '';
      DateTo = DateTo != null ? datePipe.transform(DateTo, 'yyyy-MM-dd') || '' : '';
      if(calledFor=='Appearance'){
      if (DateFrom != null && DateTo == "") {
        return items.filter(x => (datePipe.transform(x.appearance[fieldName], 'yyyy-MM-dd') || '') >= DateFrom);
      }
      if (DateFrom == "" && DateTo != null) {
        return items.filter(x => (datePipe.transform(x.appearance[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
      if (DateFrom != null && DateTo != null) {
        return items.filter(x => (datePipe.transform(x.appearance[fieldName], 'yyyy-MM-dd') || '') >= DateFrom && (datePipe.transform(x.appearance[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
    } else if(calledFor=='Application' && (profileType=='E' || profileType=='EA' || profileType =='I')) {
      if (DateFrom != null && DateTo == "") {
        return items.filter(x => (datePipe.transform(x.appearanceRDTO[fieldName], 'yyyy-MM-dd') || '') >= DateFrom);
      }
      if (DateFrom == "" && DateTo != null) {
        return items.filter(x => (datePipe.transform(x.appearanceRDTO[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
      if (DateFrom != null && DateTo != null) {
        return items.filter(x => (datePipe.transform(x.appearanceRDTO[fieldName], 'yyyy-MM-dd') || '') >= DateFrom && (datePipe.transform(x.appearanceRDTO[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
    } else if(calledFor=='Application' && profileType=='A') {
      if (DateFrom != null && DateTo == "") {
        return items.filter(x => (datePipe.transform(x[fieldName], 'yyyy-MM-dd') || '') >= DateFrom);
      }
      if (DateFrom == "" && DateTo != null) {
        return items.filter(x => (datePipe.transform(x[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
      if (DateFrom != null && DateTo != null) {
        return items.filter(x => (datePipe.transform(x[fieldName], 'yyyy-MM-dd') || '') >= DateFrom && (datePipe.transform(x[fieldName], 'yyyy-MM-dd') || '') <= DateTo);
      }
    }
      return items;
    }
    else {
      return items;
    }
  }
}
