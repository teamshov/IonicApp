import { Component, OnInit } from '@angular/core';
import { ShovService } from '../shov.service';
import { Beacon } from '../BeaconClass';

@Component({
  selector: 'app-list',
  templateUrl: 'list.page.html',
  styleUrls: ['list.page.scss']
})
export class ListPage implements OnInit {
  private selectedItem: any;
  // private ShovBeacons: Array<Beacon> = [];
  public items: Array<{ title: string; note: string; icon: string }> = [];

  constructor(private shovService: ShovService) {
    var ShovBeacons = shovService.getBeacons();
    console.log(ShovBeacons);
    for (let i = 0; i < ShovBeacons.length; i++) {
      console.log(ShovBeacons[i].getID());
      this.items.push({
        title: 'ID: ' + ShovBeacons[i].getID(),
        note: 'This has rssi: ' + ShovBeacons[i].rssi,
        icon: 'bluetooth'
      });
    }
  }
  

  ngOnInit() {
    this.shovService.bleScan();
  }

}
