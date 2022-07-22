import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterPipe'
})
export class FilterPipePipe implements PipeTransform {

  transform(items: any[], searchText: any[], fieldName: string, targetObject?: string): any[] {

    // return empty array if array is falsy
    if (!items) { return []; }

    // return the original array if search text is empty
    if (!searchText) { return items; }

    // convert the searchText to lower case
    //searchText = searchText.toLowerCase();

    // retrun the filtered array
    //return items.filter(item => {
    if (items) {
      //return item[fieldName].includes(searchText);
      if (targetObject == 'Appearance') {
        return Array.from(items).filter((x: any) => Array.from(searchText).includes(x.appearance[fieldName]));
      } else {
        return Array.from(items).filter((x: any) => Array.from(searchText).includes(x[fieldName]));
      }
      //return Array.from(items).filter((x: any) => Array.from(searchText).some(r => x[fieldName].includes(r)));
    }
    return [];
    //});
  }

}
