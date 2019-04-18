import { Component, OnInit, NgZone } from '@angular/core';
import { ShovService } from '../shov.service';
import { Beacon } from '../Util';

@Component({
  selector: 'app-list',
  templateUrl: 'pi-o-distances.page.html',
  styleUrls: ['pi-o-distances.page.scss']
})
export class PiODistancesPage implements OnInit {
  
  private selectedItem: any;
  // private ShovBeacons: Array<Beacon> = [];
  public beacons: Array<Beacon> = [];
  // private updated = true;

  constructor(private shovService: ShovService, private zone: NgZone) {

    let ShovBeacons = this.shovService.getBeacons();
      console.log(ShovBeacons);
      for (let i = 0; i < ShovBeacons.length; i++) {
        console.log(ShovBeacons[i].getID());
        this.beacons.push(ShovBeacons[i]);
      }
    
      this.shovService.updateBeaconEvent.subscribe(() => this.zone.run(() => {}));
  }

  

  ngOnInit() {
    this.shovService.bleScan();
  }


}
