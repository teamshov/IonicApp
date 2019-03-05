import { Component, OnInit, NgZone } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(public ble: BluetoothLE, public plt: Platform){
    this.plt.ready().then((readySource) => {

      console.log('Platform ready from', readySource);

      console.log(ble);
      ble.initialize();
      ble.requestPermission();

     });
  }

   
  public handleClick() {
    console.log('Hello Circle');
  }
 
  asHexString(i) {
    var hex;
  
    hex = i.toString(16);
  
    // zero padding
    if (hex.length === 1) {
        hex = "0" + hex;
    }
  
    return hex;
  }
  
  parseAdvertisingData(buffer) {
    var length, type, data, i = 0, advertisementData = {};
    var bytes = new Uint8Array(buffer);
  
    while (length !== 0) {
  
        length = bytes[i] & 0xFF;
        i++;
  
        // decode type constants from https://www.bluetooth.org/en-us/specification/assigned-numbers/generic-access-profile
        type = bytes[i] & 0xFF;
        i++;
  
        data = bytes.slice(i, i + length - 1).buffer; // length includes type byte, but not length byte
        i += length - 2;  // move to end of data
        i++;
  
        advertisementData[this.asHexString(type)] = data;
    }
  
    return advertisementData;
  }



  bleScan(){
  
    var params = {
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

    success(data){
          if(data["status"] == "scanStarted") return;

      var devdata = this.parseAdvertisingData(this.ble.encodedStringToBytes(data['advertisement']));      
      var str = "";

      new Uint8Array(devdata["16"]).slice(3, 11).forEach(e=>str+=this.asHexString(e));
      console.log(str);
      console.log(data['rssi']);
    }

    errors(err){
  
   console.log(err);
  
    }
}
