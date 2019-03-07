import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ShovService } from '../shov.service';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { MapStage } from '../mapstage/mapstage.component';
var Home = /** @class */ (function () {
    function Home(shovService, deviceOrientation, MSM) {
        this.shovService = shovService;
        this.deviceOrientation = deviceOrientation;
        this.MSM = MSM;
    }
    Home.prototype.startCompass = function () {
        this.deviceOrientation.getCurrentHeading().then(function (data) { return console.log(data); }, function (error) { return console.log(error); });
        this.MSM.drawStage();
    };
    Home = tslib_1.__decorate([
        Component({
            selector: 'app-home',
            templateUrl: 'home.page.html',
            styleUrls: ['home.page.scss'],
        }),
        tslib_1.__metadata("design:paramtypes", [ShovService,
            DeviceOrientation,
            MapStage])
    ], Home);
    return Home;
}());
export { Home };
//# sourceMappingURL=home.page.js.map