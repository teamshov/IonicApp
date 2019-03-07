import * as tslib_1 from "tslib";
import { Component } from '@angular/core';
import { ShovService } from '../shov.service';
var ListPage = /** @class */ (function () {
    function ListPage(shovService) {
        this.shovService = shovService;
        this.items = [];
        var ShovBeacons = shovService.getBeacons();
        for (var i = 1; i <= ShovBeacons.length; i++) {
            this.items.push({
                title: 'ID: ' + ShovBeacons[i].id,
                note: 'This has rssi: ' + ShovBeacons[i].rssi,
                icon: 'bluetooth'
            });
        }
    }
    ListPage.prototype.ngOnInit = function () {
        this.shovService.bleScan();
    };
    ListPage = tslib_1.__decorate([
        Component({
            selector: 'app-list',
            templateUrl: 'list.page.html',
            styleUrls: ['list.page.scss']
        }),
        tslib_1.__metadata("design:paramtypes", [ShovService])
    ], ListPage);
    return ListPage;
}());
export { ListPage };
//# sourceMappingURL=list.page.js.map