import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertifyService } from 'src/app/services/alertify.service';

@Component({
  selector: 'app-invite-message',
  templateUrl: './invite-message.component.html',
  styleUrls: ['./invite-message.component.css']
})
export class InviteMessageComponent implements OnInit {

  @Input() src: any;

  constructor(public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private router: Router) { }

  ngOnInit() {
  }

}
