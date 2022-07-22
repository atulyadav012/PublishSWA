import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AppearanceService } from 'src/app/services/appearance.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-appearance-view',
  templateUrl: './appearance-view.component.html',
  styleUrls: ['./appearance-view.component.css']
})
export class AppearanceViewComponent implements OnInit {

  @Input() Appearance: any;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private appearanceService: AppearanceService) { }

  ngOnInit() {
  }

  DownloadDocs(docname: string, name: string) {
    this.appearanceService.DownloadDocs(docname)
      .subscribe(response => {
        saveAs(response, name)
      });
  }
}
