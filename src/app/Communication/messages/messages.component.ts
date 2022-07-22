import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMessage } from 'src/app/models/message';
import { AlertifyService } from 'src/app/services/alertify.service';
import { AuthService } from 'src/app/services/auth.service';
import { CommunicationService } from 'src/app/services/communication.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  @Input() src: any;
  @Input() appearanceId: any;
  public Message: string;
  public currentUser: Number;
  public Messages: any;

  constructor(
    public activeModal: NgbActiveModal,
    public modalService: NgbModal,
    private alertify: AlertifyService,
    private communicationService: CommunicationService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.currentUser = this.authService.currentUserValue.id || 0;
    this.GetAllMessageByAppearanceId();
  }

  AddMessage() {
    const addMessage: AddMessage = {
      parentMessageId: 0,
      appearanceId: this.appearanceId,
      fromId: this.authService.currentUserValue.id || 0,
      toId: this.src,
      message:  this.Message,
      fromIdRole: this.authService.currentUserValue.profileType || ''
    }

    this.communicationService.addMessage(addMessage).subscribe(msg => {
      if (msg.isSuccess) {
        this.GetAllMessageByAppearanceId();
        this.alertify.success(msg.message);
        this.Message = '';
      }
    });
  }
  reply(msg: any) {
    this.Message = msg.fromFirstName + ':';
    this.src = msg.fromId;
  }
  GetAllMessageByAppearanceId() {
    this.communicationService.getMessageByAppearanceId(this.appearanceId, this.authService.currentUserValue.id).subscribe(msg => {
      this.Messages = msg
    });
  }
}
