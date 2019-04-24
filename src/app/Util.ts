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
    floor : string;
    building : string;

    constructor(id : any){
        this.id = id

    }

    public Set(doc : any) {
        this.id = doc["_id"];
        this.xpos = doc["xpos"]
        this.ypos = doc["ypos"]
        this.building = doc["building"]
        this.floor = doc["floor"]
        this.offset = doc["offset"]
        this.piDistance = doc["distance"]
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

export class Vec2 {
    constructor(public x: number, public y: number) { }

    static dist(v1:Vec2, v2:Vec2) {
        return Math.sqrt(Math.pow(v1.x-v2.x, 2)+Math.pow(v1.y-v2.y, 2));
    }
}

export class FloorPlanInput {
    building : string;
    image : string;
}