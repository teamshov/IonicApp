import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapStage } from './mapstage.component';
import { KonvaModule } from 'ng2-konva';
var MapStageModule = /** @class */ (function () {
    function MapStageModule() {
    }
    MapStageModule = tslib_1.__decorate([
        NgModule({
            declarations: [
                MapStage,
            ],
            imports: [
                IonicModule,
                KonvaModule,
            ],
            exports: [
                MapStage,
            ],
            entryComponents: [
                MapStage,
            ],
        })
    ], MapStageModule);
    return MapStageModule;
}());
export { MapStageModule };
//# sourceMappingURL=mapstage.module.js.map