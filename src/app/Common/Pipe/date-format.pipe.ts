import { Pipe, PipeTransform } from '@angular/core';
   import { DatePipe } from '@angular/common';
   
   @Pipe({
     name: 'DateFormat'
   })
   export class DateFormatPipe extends 
                DatePipe implements PipeTransform {
     transform(value: any, args?: any): any {
       return super.transform(value, "d MMMM y h:mm a");
     }
   }