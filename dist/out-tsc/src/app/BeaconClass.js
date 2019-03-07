var Beacon = /** @class */ (function () {
    function Beacon(id) {
        this.id = id;
    }
    Beacon.prototype.DBinfo = function (off, x, y, col) {
        this.offset = off;
        this.xpos = x;
        this.ypos = y;
        this.color = col;
    };
    Beacon.prototype.getID = function () {
        return this.id;
    };
    Beacon.prototype.updateRSSI = function (rssi) {
        this.rssi = rssi;
        this.timestamp = Date.now();
    };
    return Beacon;
}());
export { Beacon };
//# sourceMappingURL=BeaconClass.js.map