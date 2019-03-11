import { Component, OnInit, NgZone } from '@angular/core';

import { ShovService } from '../shov.service';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class Home {

  constructor(
    private shovService: ShovService, 
    private deviceOrientation: DeviceOrientation,
    ){}

}
