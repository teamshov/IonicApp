import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { DangermapPage } from './dangermap.page';
var routes = [
    {
        path: '',
        component: DangermapPage
    }
];
var DangermapPageModule = /** @class */ (function () {
    function DangermapPageModule() {
    }
    DangermapPageModule = tslib_1.__decorate([
        NgModule({
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                RouterModule.forChild(routes)
            ],
            declarations: [DangermapPage]
        })
    ], DangermapPageModule);
    return DangermapPageModule;
}());
export { DangermapPageModule };
//# sourceMappingURL=dangermap.module.js.map