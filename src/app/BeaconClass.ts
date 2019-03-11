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
        this.distance =  this.piDistance * Math.pow(10, (this.offset-this.filteredRSSI)/25);
        // console.log('ID: ' + this.id + ' distance: ' + this.distance);
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
        return this.distance;
    }
}