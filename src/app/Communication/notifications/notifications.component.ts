import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationsService } from 'src/app/services/notifications.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AlertifyService } from 'src/app/services/alertify.service';
@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  public notifications: any
  public selectAll: boolean = false;
  constructor(private notificationService: NotificationsService, private domSanitizer: DomSanitizer, private authService: AuthService,private alertify: AlertifyService) { }

  ngOnInit(): void {
    const UserId = this.authService.currentUserValue.id;
    this.GetNotifications(UserId);
  }

  GetNotifications(UserId: any) {
    this.selectAll =false;
    this.notificationService.getAllNotifications(UserId).subscribe(notification => {
      notification.model.forEach((element: any) => {
        element.formattedtriggerContent = this.domSanitizer.bypassSecurityTrustHtml(element.triggerContent);
        element.selected =false;
        if(element.recordStatus=="R")
          element.class ="notification-readed";
        else
        element.class ="notification-unreaded";
      });
      this.notifications = notification.model;
    });
  }

  CheckAll(){
    //this.selectAll = !this.selectAll;
    if(this.selectAll)
    {
      this.notifications.forEach((element: any) => {      
        element.selected =true;
      });
    }
    else{
      this.notifications.forEach((element: any) => {      
        element.selected =false;
      });
    }

  }

  DeleteNotification(notificationId:number){
    var autoIds: number[]= [];
    if(notificationId> 0)
    {
      autoIds.push(notificationId);
    }
    else{
      Array.from(this.notifications).filter((x:any)=>x.selected).forEach((x:any) =>{ 
        autoIds.push(x.autoId);
       });  
    }
    Array.from(this.notifications).filter((x:any)=>x.selected).forEach((x:any) =>{ 
      autoIds.push(x.autoId);
     });
    this.notificationService.deleteNotifications(autoIds).subscribe(res => {
      if(res.isSuccess)
      {
        if(notificationId> 0){
          var index = this.notifications.indexOf(this.notifications.find((x:any)=>x.autoId == notificationId)); 
          if(index>-1)
          {
            this.notifications.splice(index, 1);
            this.alertify.success(res.message);
          }
        }
        else{
          this.alertify.success(res.message);
          const UserId = this.authService.currentUserValue.id;
          this.GetNotifications(UserId);
        }
      }
    });
  }

  MarkReadNotification(notificationId:number){
    var autoIds: number[]= [];
    if(notificationId> 0)
    {
      autoIds.push(notificationId);
    }
    else{
      Array.from(this.notifications).filter((x:any)=>x.selected).forEach((x:any) =>{ 
        autoIds.push(x.autoId);
       });  
    }
    this.notificationService.markReadNotifications(autoIds).subscribe(res => {
      if(res.isSuccess)
      {
        if(notificationId> 0){
          var index = this.notifications.indexOf(this.notifications.find((x:any)=>x.autoId == notificationId)); 
          if(index>-1)
          {
            this.notifications[index].class ="notification-readed";
          }
        }
        else{
          this.alertify.success(res.message);
          const UserId = this.authService.currentUserValue.id;
          this.GetNotifications(UserId);
        }
      }
    });
  }
}
