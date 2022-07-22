import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attorney-info',
  templateUrl: './attorney-info.component.html',
  styleUrls: ['./attorney-info.component.css']
})
export class AttorneyInfoComponent implements OnInit {

  @Input() src: any;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private router: Router) { }

  ngOnInit() {
  }

}
