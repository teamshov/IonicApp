import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Beacon } from './BeaconClass';

var ShovBeacons: Array<Beacon> = [];


@Injectable({
  providedIn: 'root',

})
export class ShovService {
  
  constructor(
    public ble: BluetoothLE, 
    public plt: Platform, 
    private http:HTTP,
    ) {
    this.plt.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      console.log(ble);
      ble.initialize();
      ble.requestPermission();

    });
    this.http.get('http://omaraa.ddns.net:62027/allbeacons', {}, {})
  .then(data => {

    var beacondata = (JSON.parse(data.data))['beacons']; // data received by server
    for (var i = 0; i < beacondata.length; i++){
      var b = new Beacon(beacondata[i]);
      ShovBeacons.push(b);
    }    
    console.log(ShovBeacons);
  })
  .catch(error => {

    console.log(error.status);
    console.log(error.error); // error message as string
    console.log(error.headers);

  });
  }

  private asHexString(i) {
    var hex;

    hex = i.toString(16);

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
    if (data["status"] == "scanStarted") {return;}

    let devdata = this.parseAdvertisingData(this.ble.encodedStringToBytes(data['advertisement']));
    let id = '';

    new Uint8Array(devdata["16"]).slice(3, 11).forEach(e => id += this.asHexString(e));
    
    this.updateBeacon(id, data['rssi']);
  }

  errors(err) {

    console.log(err);

  }

  updateBeacon(recv_id, rssi){
    for (var i = 0; i < ShovBeacons.length; i++){
      if (ShovBeacons[i].getID() == recv_id){
        ShovBeacons[i].updateRSSI(rssi);
        console.log("Beacon: " + recv_id + " updated");
      }
    }
  }

  getBeacons(){
     return ShovBeacons;
  }
}