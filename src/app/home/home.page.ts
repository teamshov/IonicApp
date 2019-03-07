import { Component, OnInit, NgZone } from '@angular/core';

import { ShovService } from '../shov.service';
import { DeviceOrientation, DeviceOrientationCompassHeading} from '@ionic-native/device-orientation/ngx';
import { MapStage } from '../mapstage/mapstage.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class Home {

  constructor(
    private shovService: ShovService, 
    private deviceOrientation: DeviceOrientation,
    private MSM: MapStage
    ){}

  startCompass(){
    this.deviceOrientation.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => console.log(data),
      (error: any) => console.log(error)
    );
    this.MSM.drawStage();
  }
}
