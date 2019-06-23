import {
  EventEmitter,
  Injectable
} from '@angular/core';
import {
  Platform
} from '@ionic/angular';
import {
  BluetoothLE
} from '@ionic-native/bluetooth-le/ngx';
import {
  HTTP
} from '@ionic-native/http/ngx';

import {Beacon, Vec2, FloorPlanInput} from './Util';
import { interval } from 'rxjs';
import $ from 'jquery';




function probabilityFunc(upos, bpos, mean, std) {
  if (std < 1)
    std = 1;
  let dist = Math.sqrt((upos.x - bpos.x) ** 2 + (upos.y - bpos.y) ** 2);
  let A = Math.exp(-((dist - mean) ** 2) / (2 * (std) ** 2));
  let B = 1 / (std * Math.sqrt(2 * Math.PI));
  return A * B;
}


@Injectable({
  providedIn: 'root',

})
export class ShovService {

  //Grid size parameters 
  static gridX : number = 40;
  static gridY : number = 56;
  static maxDelay : number = 5000;
  updatedBuilding: boolean = false;
  enterBeaconRSSI: string; 
  buildingName: string;
  floorName: string;
  imageName: string;
  testPos: Vec2;

  beacons: {
    [key: string]: Beacon;
  } = {};


  updateBeaconEvent: EventEmitter < boolean > = new EventEmitter();
  updateStateEvent: EventEmitter < Vec2 > = new EventEmitter();
  floorImageEvent : EventEmitter<boolean> = new EventEmitter();

  updateInterval: any;
  pos : Vec2 = {x:0, y:0};


  constructor(
    public ble: BluetoothLE,
    public plt: Platform,
    private http: HTTP,
  ) {

    this.plt.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      console.log(ble);
      ble.initialize();
      ble.requestPermission();
      ble.isLocationEnabled().then(status => {
          if (!status) ble.requestLocation();
        },
        error => {
          console.log(error);
        });
      ble.isLocationEnabled().then(status => {
          if (!status) ble.requestLocation();
        },
        error => {
          console.log(error);
        });
      
      this.bleScan();
    });
    

    
    this.updateInterval = setInterval(this.updateState.bind(this), 500);
  }

  private asHexString(i) {
    let hex = i.toString(16);
    // zero padding
    if (hex.length === 1) {
      hex = "0" + hex;
    }
    return hex;
  }

  private parseAdvertisingData(buffer) {
    let length, type, data, i = 0;
    const advertisementData = {};
    let bytes = new Uint8Array(buffer);

    while (length !== 0) {

      length = bytes[i] & 0xFF;
      i++;

      // decode type constants from https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
      type = bytes[i] & 0xFF;
      i++;

      data = bytes.slice(i, i + length - 1).buffer; // length includes type byte, but not length byte
      i += length - 2; // move to end of data
      i++;

      advertisementData[this.asHexString(type)] = data;
    }

    return advertisementData;
  }

  initBeacon(id : any) {
    this.http.get(('http://omaraa.ddns.net:62027/db/beacons/' + id), {}, {}).then(
      bdata => {
        this.beacons[id] = new Beacon(id)
        let beaconDoc = JSON.parse(bdata.data);
        this.beacons[id].Set(beaconDoc);
        let b = this.beacons[id];
        this.beacons[b.id] = b;

        if (this.buildingName != b.building || this.floorName != b.floor){
          this.buildingName = b.building;
          this.floorName = b.floor;
          this.updatedBuilding = true;
          
        }
        
      }
    ).catch((err)=>{
      console.log(err)
    });
  }

  initBuilding() {

    this.http.get(('http://omaraa.ddns.net:62027/db/buildings/' + this.buildingName), {}, {}).then(
      data => {
        alert("welcome to " + this.buildingName + " " + this.floorName);

        let doc = JSON.parse(data.data);
        this.imageName = doc["floors"][this.floorName]["image"];
        this.floorImageEvent.next()
      }
    ).catch((err)=>{
      console.log(err)
    });

    
  }

  bleScan() {

    let params = {
      "services": [
        "FE9A"
      ],
      "allowDuplicates": true,
      "scanMode": this.ble.SCAN_MODE_LOW_LATENCY,
      "matchNum": this.ble.MATCH_NUM_MAX_ADVERTISEMENT,
      // "callbackType": this.ble.CALLBACK_TYPE_ALL_MATCHES,
    }

    this.ble.startScan(params).subscribe(
      data => this.success(data),
      err => this.errors(err)
    );

  }

  stopScan() {
    this.ble.stopScan();
  }

  success(data) {
    if(data["advertisement"] == null) {
      console.log(data)
      return;
    }
    let devdata = this.parseAdvertisingData(this.ble.encodedStringToBytes(data['advertisement']));
    let id = '';

    new Uint8Array(devdata["16"]).slice(3, 11).forEach(e => id += this.asHexString(e));

    if(this.beacons[id] == null) {
      console.log("initializing " + id);
      //this.beacons[id] = new Beacon(id);
      this.initBeacon(id);
    }
    else 
      this.updateBeacon(id, data['rssi']);
  }

  errors(err) {

    console.log(err);

  }

  updateBeacon(id, rssi) {
    if (id in this.beacons) {
      this.beacons[id].updateRSSI(rssi);
      this.updateBeaconEvent.next();
    }
  }

  max : number  = 0;
  maxVal : Vec2 = {x: 0, y: 0};

  updateState() {

    if(this.updatedBuilding == true) {
      this.initBuilding();
      this.updatedBuilding = false;
    }

    this.max = 0;
    this.maxVal = {x:0,y:0};

    for (let x = 0; x < ShovService.gridX; x++) {
      for (let y = 0; y < ShovService.gridY; y++) {
        let gridCell = { x: x, y: y };
        let value = 0;
        let beacons = this.getBeacons();
        for (let i = 0; i < beacons.length; i++) {
          let x2 = beacons[i].getXpos();
          let y2 = beacons[i].getYpos();
          let distance = beacons[i].getDistance();
          if (typeof (distance) != 'number' || isNaN(distance)) {
            continue;
          }
          let beaconpos = { x: x2, y: y2 };
          value += probabilityFunc(gridCell, beaconpos, distance, distance);

        }
        if (value > this.max) {
          this.maxVal.x = x;
          this.maxVal.y = y;
          this.max = value;
        }

      }
    }
    this.pos = this.maxVal;
    this.updateStateEvent.next(this.maxVal);
  }

  getBeacons() {
    return Object.values(this.beacons);
  }

  getAvailableBeacons() {
    return Object.values(this.beacons).filter(this.isBeaconValid);
  }

  isBeaconValid(beacon) {
    return (Date.now() - beacon.getTimestamp()) > ShovService.maxDelay;
  }

  test:Test;
  sub:any;
  dist:any;
  runTest(testnm : string,  numberofreadings: number) {
    let testname = testnm + ";" + JSON.stringify(this.testPos) + ";" + Date.now();
    let rpos = this.testPos;
    this.test = new Test(testname, rpos, numberofreadings);

    this.sub = this.updateStateEvent.subscribe((pos)=>{
      if(this.test.n >= this.test.MAXN) {
        alert("Done!");
        this.sub.unsubscribe();

        $.ajaxSetup({
          contentType : 'application/json',
          processData : false
      });
          $.ajax({
            url: 'http://omaraa.ddns.net:62027/db/tests/'+this.test.name,    //Your api url
            type: 'PUT',   //type is any HTTP method
            data: JSON.stringify(this.test),      //Data as js object
            success: function () {
            }
        });
      }
      this.test.n += 1;
      this.dist = Vec2.dist(pos, this.test.realpos);
      this.test.distances.push(this.dist);
    })
  }
}

class Test {
  distances: Array<number> = []
  n: number = 0;

  constructor(public name: string, public realpos: Vec2, public MAXN: number) {

  }


}