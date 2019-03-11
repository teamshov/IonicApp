import { Component, OnInit } from '@angular/core';
import { ShovService } from '../shov.service';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
@Component({
  selector: 'app-dangermap',
  templateUrl: './dangermap.page.html',
  styleUrls: ['./dangermap.page.scss'],
})
export class DangermapPage {

  constructor(
    private shovService: ShovService, 
    private deviceOrientation: DeviceOrientation,
    ){}
}
