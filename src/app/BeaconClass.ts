import { identifierModuleUrl } from '@angular/compiler';
const alpha = 0.1;

export class Beacon {
    
    id: string;
    recvRSSI: number;
    color: string;
    offset: number;
    filteredRSSI: number;
    xpos: number;
    ypos: number;
    timestamp: number;
    distance: number;
    piDistance: number;
    static_dist: number;
    alt_dist: number;

    constructor(id: string){
        this.id = id;
    }

    public DBinfo(off, x, y, col, piD){
        this.offset = off;
        this.xpos = x;
        this.ypos = y;
        this.color = col;
        this.piDistance = piD;
    }

    public getID(){
        return this.id;
    }

    public updateRSSI(rssi){
        this.recvRSSI = rssi;
        this.timestamp = Date.now();
        if(this.filteredRSSI != null) {
            var max = Math.max(this.recvRSSI, this.filteredRSSI)
            var min = Math.min(this.recvRSSI, this.filteredRSSI)
            this.filteredRSSI = min*alpha+max*(1-alpha);
            
          } else {
            this.filteredRSSI = this.recvRSSI;
          }
        this.distance =  parseFloat((Math.pow(10, (this.offset-this.filteredRSSI)/20)).toFixed(2));
        this.static_dist =  parseFloat((Math.pow(10, (-65-this.filteredRSSI)/20)).toFixed(2));
        this.alt_dist = this.calcDist(this.offset, this.filteredRSSI);
    }

    calcDist(txPower, rssi) {
        if (rssi == 0) {
            return -1.0; // if we cannot determine distance, return -1.
        }

        let ratio = rssi*1.0/txPower;
        if (ratio < 1.0) {
            return Math.pow(ratio,10);
        }
        else {
            let accuracy =  (0.89976)*Math.pow(ratio,7.7095) + 0.111;
            return accuracy;
        }
    }

    public getTimestamp(){
        return this.timestamp;
    }

    public getXpos(){
        return this.xpos;
    }

    public getYpos(){
        return this.ypos;
    }

    public getDistance(){
        return this.static_dist;
    }
}