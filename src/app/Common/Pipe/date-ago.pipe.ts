import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo'
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, ...args: unknown[]): unknown {
    var date = new Date();
    if (!value) { return 'a long time ago'; }
    const d1:Date = new Date(); 
    const utcDate:any = new Date( d1.getUTCFullYear(), d1.getUTCMonth(), d1.getUTCDate(), d1.getUTCHours(), d1.getUTCMinutes(), d1.getUTCSeconds() );
    // currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());
    // currentDate.tim
    let time = (utcDate - Date.parse(value)) / 1000 ;
    if (time < 10) {
      return 'just now';
    } else if (time < 60) {
      return 'a moment ago';
    }
    const divider = [60, 60, 24, 30, 12];
    const string = [' second', ' minute', ' hour', ' day', ' month', ' year'];
    let i;
    for (i = 0; Math.floor(time / divider[i]) > 0; i++) {
      time /= divider[i];
    }
    const plural = Math.floor(time) > 1 ? 's' : '';
    return Math.floor(time) + string[i] + plural + ' ago';
  }
}
