import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Home } from './home.page';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { MapStageModule } from '../mapstage/mapstage.module';
import { MapStage } from '../mapstage/mapstage.component';
var HomePageModule = /** @class */ (function () {
    function HomePageModule() {
    }
    HomePageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                MapStageModule,
                RouterModule.forChild([
                    {
                        path: '',
                        component: Home
                    }
                ])
            ],
            providers: [
                BluetoothLE,
                MapStage
            ],
            declarations: [Home]
        })
    ], HomePageModule);
    return HomePageModule;
}());
export { HomePageModule };
//# sourceMappingURL=home.module.js.map