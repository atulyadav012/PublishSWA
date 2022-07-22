import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'commonFilter'
})
export class CommonFilterPipe implements PipeTransform {


  transform(items: any[], searchText: Map<string, any>, targetObject?: string): any[] {
    let resultArray: any[] = [];
    let i = 0;
    // return empty array if array is falsy
    if (!items) { return []; }

    if (items) {
      if (searchText.size > 0) {
        if (targetObject == 'Appearance') {
          for (let key of searchText.keys()) {
            i = i + 1;
            if (i > 1) {
              resultArray = Array.from(resultArray).filter((x: any) => Array.from(searchText.get(key)).includes(x.appearance[key]));
            } else {
              resultArray = Array.from(items).filter((x: any) => Array.from(searchText.get(key)).includes(x.appearance[key]));
            }
          }
        }
        else if (items[0]?.attorneyRDTO?.length > 0 && targetObject == "Application") {
          for (let key of searchText.keys()) {
            i = i + 1;
            if (key == 'languages' || key == 'practiceAreaId') {
              if (i > 1) {
                Array.from(resultArray).forEach(element => {
                  if (Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r))).length > 0) {
                    element.attorneyRDTO = Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r)));
                    resultArray.push(element);
                  } else {
                    resultArray = [];
                  }
                })
              } else {
                Array.from(items).forEach(element => {
                  if (Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r))).length > 0) {
                    element.attorneyRDTO = Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r)));
                    resultArray.push(element);
                  } else {
                    resultArray = [];
                  }
                })
              }
            } else {
              if (i > 1) {
                Array.from(resultArray).forEach(element => {
                  if (Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).includes(x[key])).length > 0) {
                    resultArray.push(element);
                  }
                })
              } else {
                Array.from(items).forEach(element => {
                  if (Array.from(element.attorneyRDTO).filter((x: any) => Array.from(searchText.get(key)).includes(x[key])).length > 0) {
                    resultArray.push(element);
                  }
                })
              }
            }
          }
        }
        else {
          for (let key of searchText.keys()) {
            i = i + 1;
            if (key == 'languages' || key == 'practiceAreaId') {
              if (i > 1) {
                resultArray = Array.from(resultArray).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r)));
              } else {
                resultArray = Array.from(items).filter((x: any) => Array.from(searchText.get(key)).some(r => x[key].includes(r)));
              }
            } else {
              if (i > 1) {
                resultArray = Array.from(resultArray).filter((x: any) => Array.from(searchText.get(key)).includes(x[key]));
              } else {
                resultArray = Array.from(items).filter((x: any) => Array.from(searchText.get(key)).includes(x[key]));
              }
            }
          }
        }
      } else {
        resultArray = items;
      }
      return resultArray;
    }
    return [];
  }

}
