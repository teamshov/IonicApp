import { Component, OnInit, NgZone } from '@angular/core';
import { ShovService } from '../shov.service';
import { Beacon } from '../BeaconClass';

@Component({
  selector: 'app-alternate-distances',
  templateUrl: './alternate-distances.page.html',
  styleUrls: ['./alternate-distances.page.scss'],
})

export class AlternateDistancesPage implements OnInit {
  
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
