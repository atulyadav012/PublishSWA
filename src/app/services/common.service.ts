import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { CommonConstant } from '../Common/Constants/Constants';
import { AlertifyService } from './alertify.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private alertify: AlertifyService) { }
  getDropDownText(id: any, object: any){
    const selObj = _.filter(object, function (o: { autoId: any; }) {
        return (_.includes(id,o.autoId));
    });
    return selObj;
  }

  fileUpload(event: any){
    let docToUpload: any = [];
    Array.from(event.target.files).forEach((element: any) => {
      if (element.size < CommonConstant.RESPONSE_MESSAGES.MB_SIZE) {
        if (CommonConstant.ALLOWED_FILE_TYPES.includes(element.name.split('.')[1])) {
          docToUpload.push(element);
        } else {
          this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_TYPE_ERROR);
        }
      } else {
        this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_SIZE_ERROR);
      }
    });

    return docToUpload;
  }
}
