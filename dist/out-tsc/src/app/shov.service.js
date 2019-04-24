import * as tslib_1 from "tslib";
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { HTTP } from '@ionic-native/http/ngx';
import { Beacon } from './BeaconClass';

var ShovService = /** @class */ (function () {
    function ShovService(ble, plt, http, ShovBeacons) {
        if (ShovBeacons === void 0) { ShovBeacons = new Array(); }
        this.ble = ble;
        this.plt = plt;
        this.http = http;
        this.ShovBeacons = ShovBeacons;
        this.plt.ready().then(function (readySource) {
            console.log('Platform ready from', readySource);
            console.log(ble);
            ble.initialize();
            ble.requestPermission();
        });
        this.http.get('http://omaraa.ddns.net:62027/allbeacons', {}, {})
            .then(function (data) {
            var beacondata = (JSON.parse(data.data))['beacons']; // data received by server
            for (var i = 0; i < beacondata.length; i++) {
                var b = new Beacon(beacondata[i]);
                ShovBeacons.push(b);
            }
            console.log(ShovBeacons);
        })
            .catch(function (error) {
            console.log(error.status);
            console.log(error.error); // error message as string
            console.log(error.headers);
        });
    }
    ShovService.prototype.asHexString = function (i) {
        var hex;
        hex = i.toString(16);
        // zero padding
        if (hex.length === 1) {
            hex = "0" + hex;
        }
        return hex;
    };
    ShovService.prototype.parseAdvertisingData = function (buffer) {
        var length, type, data, i = 0;
        var advertisementData = {};
        var bytes = new Uint8Array(buffer);
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
    };
    ShovService.prototype.bleScan = function () {
        var _this = this;
        var params = {
            "services": [
                "FE9A"
            ],
            "allowDuplicates": true,
            "scanMode": this.ble.SCAN_MODE_LOW_LATENCY,
            "matchNum": this.ble.MATCH_NUM_MAX_ADVERTISEMENT,
        };
        this.ble.startScan(params).subscribe(function (data) { return _this.success(data); }, function (err) { return _this.errors(err); });
    };
    ShovService.prototype.stopScan = function () {
        this.ble.stopScan();
    };
    ShovService.prototype.success = function (data) {
        var _this = this;
        if (data["status"] == "scanStarted") {
            return;
        }
        var devdata = this.parseAdvertisingData(this.ble.encodedStringToBytes(data['advertisement']));
        var id = '';
        new Uint8Array(devdata["16"]).slice(3, 11).forEach(function (e) { return id += _this.asHexString(e); });
        this.updateBeacon(id, data['rssi']);
    };
    ShovService.prototype.errors = function (err) {
        console.log(err);
    };
    ShovService.prototype.updateBeacon = function (recv_id, rssi) {
        for (var i = 0; i < this.ShovBeacons.length; i++) {
            if (this.ShovBeacons[i].getID() == recv_id) {
                this.ShovBeacons[i].updateRSSI(rssi);
                console.log("Beacon: " + recv_id + " updated");
            }
        }
    };
    ShovService.prototype.getBeacons = function () {
        return this.ShovBeacons;
    };
    ShovService = tslib_1.__decorate([
        Injectable({
            providedIn: 'root',
        }),
        tslib_1.__metadata("design:paramtypes", [BluetoothLE,
            Platform,
            HTTP,
            Array])
    ], ShovService);
    return ShovService;
}());
export { ShovService };
//# sourceMappingURL=shov.service.js.map