import { identifierModuleUrl } from '@angular/compiler';

export class Beacon {
    id: string;
    rssi: number;
    color: string;
    offset: number;
    xpos: number;
    ypos: number;
    timestamp: number;

    constructor(id: string){
        this.id = id;
    }

    public DBinfo(off, x, y, col){
        this.offset = off;
        this.xpos = x;
        this.ypos = y;
        this.color = col;
    }

    public getID(){
        return this.id;
    }

    public updateRSSI(rssi){
        this.rssi = rssi;
        this.timestamp = Date.now();
    }
}