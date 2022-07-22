import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Rating } from 'src/app/models/invoice';
import { AuthService } from 'src/app/services/auth.service';
import { InvoiceService } from 'src/app/services/invoice.service';

@Component({
  selector: 'app-rate',
  templateUrl: './rate.component.html',
  styleUrls: ['./rate.component.css']
})
export class RateComponent implements OnInit {

  @Input() ToId: any;
  @Input() appearanceId: any;
  rating = 5;
  public headerText: any;
  public Message: string;
  constructor(public activeModal: NgbActiveModal, public authService: AuthService, private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.headerText = this.authService.currentUserValue.profileType == 'E' || this.authService.currentUserValue.profileType == 'I' || this.authService.currentUserValue.profileType == 'EA' ? 'Attorney' : 'Employer';
  }

  Submit() {
    let rate: Rating = {
      userMasterId: this.ToId,
      ratingById: this.authService.currentUserValue.id || 0,
      ratingPoints: this.rating,
      ratingRemarks: this.Message,
      appearanceId: this.appearanceId,
      ratingByType: this.authService.currentUserValue.profileType == 'EA' ? 'E' : this.authService.currentUserValue.profileType || '',
      userMasterType: ''
    };
    this.invoiceService.AddRating(rate).subscribe(event => {
      this.activeModal.close();
      window.location.reload();
    })

  }
}
