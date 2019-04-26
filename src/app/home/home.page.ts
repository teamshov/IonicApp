import { Component, OnInit, NgZone } from '@angular/core';

import { ShovService } from '../shov.service';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HTTP } from '@ionic-native/http/ngx';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class Home {

  toolbarColor:string = "blue";
  prevStatus:boolean = false;
  constructor(
    private shovService: ShovService, 
    private deviceOrientation: DeviceOrientation,
    private plt: Platform, 
    private localNotifications: LocalNotifications, 
    private alertCtrl: AlertController,
    private backgroundMode: BackgroundMode,
    private http: HTTP
    ){
      this.plt.ready().then(() => {
        this.localNotifications.on('trigger').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
      });
      setInterval(this.emergencyNotification.bind(this), 2000);
      this.backgroundMode.enable();
      
    }

    emergencyNotification() {
        this.http.get(('http://omaraa.ddns.net:62027/emergency'), {}, {}).then(
          data => {
            let estatus = JSON.parse(data.data);
            console.log(estatus);
            if (estatus == true && this.prevStatus == false){
              this.prevStatus = true;
              this.localNotifications.schedule({
                id: 1,
                title: 'Emergency',
                text: 'Please evacuate immediately',
                trigger: { in: 0.1, unit: ELocalNotificationTriggerUnit.SECOND },
                foreground: true // Show the notification while app is open
              });
              this.toolbarColor = 'red';
            }
            else if (estatus == false && this.prevStatus == true){
              this.prevStatus = false;
            }
          }
        );              
      }

    showAlert(header, sub, msg) {
      this.alertCtrl.create({
        header: header,
        subHeader: sub,
        message: msg,
        buttons: ['Ok']
      }).then(alert => alert.present());
    }
  
}
