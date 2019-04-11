import { Directive, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import Konva from 'konva';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { ShovService } from '../shov.service';

//Grid size parameters 
const gridX = 40;
const gridY = 36;

//Compass heading parameters 
const alphaComp = 0.5; //To smoothen compass readings 
const alphaLoc = 0.2;
const mapCompassOffset = 40; //Basic offset of the given map 

//Links
const pathURL = 'http://omaraa.ddns.net:62027/getpath'
const mapURL = 'http://omaraa.ddns.net:62027/db/buildings/eb2/L1_Grey.png';

//Scaling parameters 
const pixel_to_meters_scale = 4.697624908;
const dpi_scale = 96 / 1080;
const image_scale = 3;
const origin_x = 0.32;
const origin_y = 264.18;

class Vec2 {
    constructor(public x: number, public y: number) { }
}

// toKonvaCoords()
function scaleX(x: number) {
    return image_scale * (x * pixel_to_meters_scale + origin_x);
}

function scaleY(y: number) {
    return image_scale * (y * (-pixel_to_meters_scale) + origin_y);
}

const toKPos = function (pos: Vec2): Vec2 {
    return new Vec2((pos.x * pixel_to_meters_scale + origin_x) * image_scale, (pos.y * (-pixel_to_meters_scale) + origin_y) * image_scale);
}

const toPos = function (pos: Vec2): Vec2 {
    return new Vec2((pos.x / image_scale - origin_x) / pixel_to_meters_scale, (pos.y / image_scale - origin_y) / (-pixel_to_meters_scale));
}

function probabilityFunc(upos, bpos, mean, std) {
  if (std < 1)
    std = 1;
  let dist = Math.sqrt((upos.x - bpos.x) ** 2 + (upos.y - bpos.y) ** 2);
  let A = Math.exp(-((dist - mean) ** 2) / (2 * (std) ** 2));
  let B = 1 / (std * Math.sqrt(2 * Math.PI));
  return A * B;
}

function heatMapColorforValue(value) {
  let h = (1.0 - value) * 240;
  return ('hsl(' + h + ', 100%, 50%)');
}

@Directive({
  selector: '[mapstage]',
})
export class MapStage implements OnDestroy {
  dO = new DeviceOrientation();

  maplayer: any;
  gridlayer: any;
  wedgelayer: any;
  stage: any;
  floorplan: any;
  grid: any;
  heading: number = null;
  wedge: any;
  exitpath: any;
  exitarrow: any;
  prevLoc: Vec2 = {x:0,y:0};

  updateCompassInterval: any;
  updateGridInterval: any;

  constructor(elem: ElementRef, renderer: Renderer2, private shovService: ShovService) {
    renderer.addClass(elem.nativeElement, 'konva');
    this.stage = new Konva.Stage({
      container: elem.nativeElement,
      width: innerWidth,
      height: innerHeight,
      draggable: true
    }
    );
    // this.stage.on('tap', () => this.drawPath());

    console.log('Stage Constructed');

    this.maplayer = new Konva.Layer({});
    this.setFloorplan(this.maplayer, this.floorplan);

    this.gridlayer = new Konva.Layer({});
    this.setGrid(this.gridlayer);

    this.wedgelayer = new Konva.Layer({});
    this.setWedge(this.wedgelayer);

    this.exitpath = new Konva.Line({
      points: [0, 0],
      stroke: 'blue',
      strokeWidth: 10,
      lineCap: 'round',
      lineJoin: 'round'
    });

    this.exitarrow = new Konva.Arrow({
      points: [0, 0],
      stroke: 'blue',
      fill: 'red',
      strokeWidth: 10,
      pointerLength: 20,
      pointerWidth: 15
    });

    this.wedgelayer.add(this.exitpath);
    this.wedgelayer.add(this.exitarrow);

    this.stage.add(this.maplayer);
    this.stage.add(this.gridlayer);
    this.stage.add(this.wedgelayer);

    this.stage.draw();

    this.updateCompassInterval = setInterval(this.drawStage.bind(this), 16);
    this.updateGridInterval = setInterval(this.updateState.bind(this), 500);
  }

  ngOnDestroy() {
    clearInterval(this.updateCompassInterval);
    clearInterval(this.updateGridInterval);
    this.stage.destroy();
  }

  drawPath() {
    // var transform = this.stage
    //   .getAbsoluteTransform()
    //   .copy();

    // // to detect relative position we need to invert transform
    // transform.invert();

    // now we find relative point
    var pos = this.wedge.position();
    //var realpos = toPos(transform.point(pos));

    //To draw path using real location
    var realpos = toPos(pos)

    fetch(pathURL, { method: 'PUT', headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(realpos) })
      .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
      .then(response => {
        var arr = JSON.parse(response);
        var arrowangle = 180 - (180 * (Math.atan2((arr[3] - arr[1]), (arr[2] - arr[0]))) / Math.PI);

        // here you do what you want with response
        for (var i = 0; i < response.length; i = i + 2) {
          arr[i] = scaleX(arr[i])
          arr[i + 1] = scaleY(arr[i + 1])
        }
        this.exitpath.points(arr);
        this.exitarrow.position({ x: arr[0], y: arr[1] });

        // console.log(arrowangle);
        this.exitarrow.rotation(arrowangle);
        this.wedgelayer.draw();
      })
      .catch(err => {
        console.log(err)
        alert("sorry, there are no results for your search")
      });

  }

  drawStage() {
    this.gridlayer.batchDraw();
    this.drawPath();

  }

  setFloorplan(bglayer, floorplan) {

    let imageObj = new Image();
    imageObj.onload = function () {
      floorplan = new Konva.Image({
        x: 0,
        y: 0,
        image: this,
        width: imageObj.width * image_scale * dpi_scale,
        height: imageObj.height * image_scale * dpi_scale,
        opacity: 1,
      });
      bglayer.add(floorplan);
      bglayer.draw();
    };
    imageObj.src = mapURL;
  }

  setGrid(gridlayer) {
    this.grid = new Array(gridX);
    for (let i = 0; i < gridX; i++) {
      this.grid[i] = new Array(gridY);
    }

    for (let x = 0; x < gridX; x++) {
      for (let y = 0; y < gridY; y++) {
        this.grid[x][y] = new Konva.Rect(
          {
            x: scaleX(x),
            y: scaleY(y),
            width: 5,
            height: 5,
            fill: 'black',
          }
        );
        gridlayer.add(this.grid[x][y]);
      }
    }
    gridlayer.batchDraw();
  }

  setWedge(wedgelayer) {
    this.wedge = new Konva.Wedge({
      x: 0,
      y: 0,
      radius: 20,
      angle: 60,
      fill: 'red',
      stroke: 'black',
      strokeWidth: 1,
      rotation: 0
    });
    wedgelayer.add(this.wedge);
    wedgelayer.batchDraw();
  }

  drawWedgePos(position) {
    let kpos = toKPos(position);
    this.prevLoc = {x: alphaLoc*kpos.x + (1-alphaLoc)*this.prevLoc.x, y: alphaLoc*kpos.y + (1-alphaLoc)*this.prevLoc.y};
    this.wedge.position(this.prevLoc);
    this.dO.getCurrentHeading().then(
      (data: DeviceOrientationCompassHeading) => {
        if (this.heading == null) this.heading = 360 - (data.magneticHeading + mapCompassOffset);
        else this.heading = alphaComp * (360 - (data.magneticHeading + mapCompassOffset)) + (1 - alphaComp) * this.heading;
        this.wedge.rotation(this.heading);
      }, (error: any) => console.log(error)
    );
  }

  updateState() {
    let max = 0;
    let maxVal: Vec2 = {x:0,y:0};

    for (let x = 0; x < gridX; x++) {
      for (let y = 0; y < gridY; y++) {
        let gridCell = { x: x, y: y };
        let value = 0;
        let beacons = this.shovService.getBeacons();
        for (let i = 0; i < beacons.length; i++) {
          let x2 = beacons[i].getXpos();
          let y2 = beacons[i].getYpos();
          let distance = beacons[i].getDistance();
          if (typeof (distance) != 'number' || isNaN(distance)) {
            continue;
          }
          let beaconpos = { x: x2, y: y2 };
          value += probabilityFunc(gridCell, beaconpos, distance, distance);

        }
        if (value > max) {
          maxVal.x = x;
          maxVal.y = y;
          max = value;
        }
        this.grid[x][y].fill(heatMapColorforValue(value));

      }
    }
    this.grid[maxVal.x][maxVal.y].fill('red');
    
    this.drawWedgePos(maxVal);
    console.log(this.prevLoc.x + ', ' + this.prevLoc.y);
  }

}
