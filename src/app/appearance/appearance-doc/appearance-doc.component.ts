import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AppearanceService } from 'src/app/services/appearance.service';
import { AuthService } from 'src/app/services/auth.service';
import { saveAs } from 'file-saver';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonConstant } from 'src/app/Common/Constants/Constants';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-appearance-doc',
  templateUrl: './appearance-doc.component.html',
  styleUrls: ['./appearance-doc.component.css']
})
export class AppearanceDocComponent implements OnInit {

  @Input() src: any;
  public DocList: any = [];
  public DoctoUpload: any = [];
  public selectedFiles: any = [];
  public id: number;
  public fileNames: any = [];
  public profileType: string;
  public finalFormData = new FormData();
  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private appearanceService: AppearanceService,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private commonService: CommonService,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
    this.GetAppearanceDocById();
    this.profileType = this.authService.currentUserValue.profileType || '';
  }

  GetAppearanceDocById() {
    this.spinner.show();
    this.appearanceService.GetAppearanceDocById(this.src).subscribe(doc => {
      this.DocList = doc;
      this.spinner.hide();
    });
  }
  uploadDocument(event: any) {
    if (event.target.files.length === 0) {
      return;
    }
    if (event.target.files.length <= CommonConstant.FILE_LENGTH && this.DocList.length < CommonConstant.FILE_LENGTH) {
      Array.from(event.target.files).forEach((element: any) => {
        if (element.size < CommonConstant.RESPONSE_MESSAGES.MB_SIZE) {
          if (CommonConstant.ALLOWED_FILE_TYPES.includes(element.name.split('.')[1])) {
            this.DocList.push(element);
          } else {
            this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_TYPE_ERROR);
          }
        } else {
          this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FILE_SIZE_ERROR);
        }
      });
    } else {
      this.alertify.error(CommonConstant.RESPONSE_MESSAGES.FIEL_LENGTH_ERROR);
    }
  }
  DeleteFile(file: any) {
    this.DocList = Array.from(this.DocList).filter((x: any) => x.name != file.name);
  }
  RetriveFileNames() {
    Array.from(this.DocList).forEach((element: any) => {
      //following 1 lines modified by atul on 9 apr 22 for fix bug 415 Doc upload feature not working on Mozilla browser
      const checkFiles = ('lastModifiedDate' in element) || ('lastModified' in element);
      if (!checkFiles) {
        this.fileNames.push(element.relativePath);
        this.DocList = Array.from(this.DocList).filter((x: any) => x.name != element.name);
      }
    })
  }
  DownloadDocs(relativePath: string, docname: string) {
    this.appearanceService.DownloadDocs(relativePath)
      .subscribe(response => {
        saveAs(response, docname)
      });
  }
  Save() {
    this.spinner.show();
    this.RetriveFileNames();
    this.finalFormData.append('UserMasterId', JSON.stringify(this.authService.currentUserValue.id));
    if (this.fileNames) {
      for (let index = 0; index < this.fileNames.length; index++) {
        this.finalFormData.append('FileNames', this.fileNames[index])

      }
    }
    if (this.DocList) {
      for (var i = 0; i < this.DocList.length; i++) {
        // Store form name as "file" with file data
        this.finalFormData.append("Files", this.DocList[i], this.DocList[i].name);
      }
    }
    this.appearanceService.UpdateAppearanceDoc(this.src, this.finalFormData)
      .subscribe(event => {
        if (event.isSuccess) {

          this.alertify.success(event.message);
          this.spinner.hide();
          //this.router.navigate(['/appearance-list', 'Open']);
          this.activeModal.dismiss('Cross click');
        } else {
          this.alertify.error(event.message);
        }
      });
  }
}
