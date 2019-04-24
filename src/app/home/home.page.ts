import { Component, OnInit, NgZone } from '@angular/core';

import { ShovService } from '../shov.service';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { LocalNotifications, ELocalNotificationTriggerUnit, ILocalNotificationActionType, ILocalNotification } from '@ionic-native/local-notifications/ngx';
import { AlertController, Platform } from '@ionic/angular';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { EmptyError } from 'rxjs';
@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class Home {

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
        this.localNotifications.on('click').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
   
        this.localNotifications.on('trigger').subscribe(res => {
          let msg = res.data ? res.data.mydata : '';
          this.showAlert(res.title, res.text, msg);
        });
      });
      this.backgroundMode.enable();
    }

    notify(){
      setInterval(this.scheduleNotification.bind(this), 2000);
    }

    scheduleNotification() {
      this.http.get(('http://omaraa.ddns.net:62027/emergency'), {}, {}).then(
            data => {
              let parsedData = JSON.parse(data.data);
              let emergency = parsedData['emergencyStatus'];
              if (emergency){
                this.localNotifications.schedule({
                  id: 1,
                  title: 'Emergency',
                  text: 'Please evacuate immediately',
                  trigger: { in: 1, unit: ELocalNotificationTriggerUnit.SECOND },
                  foreground: true // Show the notification while app is open
                });
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
