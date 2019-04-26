import { Directive, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import Konva from 'konva';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { ShovService } from '../shov.service';
import { stages } from 'konva/types/Stage';
import {Vec2} from '../Util'
import { Device } from '@ionic-native/device/ngx';
 
//Grid size parameters 
const gridX = 40;
const gridY = 36;

//Compass heading parameters 
const alphaComp= 0.1; //To smoothen compass readings 
const alphaLoc = 0.2;
const mapCompassOffset = 60; //Basic offset of the given map 

//Links
let pathURL = 'http://omaraa.ddns.net:62027/getpath/';
const mapURL = 'http://omaraa.ddns.net:62027/db/buildings/';

//Scaling parameters 
const pixel_to_meters_scale = 4.697624908;
const dpi_scale = 96 / 1080;
const image_scale = 3;
const origin_x = 0.32;
const origin_y = 264.18;


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

function heatMapColorforValue(value) {
  let h = (1.0 - value) * 240;
  return ('hsl(' + h + ', 100%, 50%)');
}

@Directive({
  selector: '[mapstage]',
})
export class MapStage implements OnDestroy {
  dO = new DeviceOrientation();
  UID:any;
  DID: any;

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

  renderInterval: any;
  updateInterval: any;
  updatesubs : any;
  newFloorImageSub : any;

  constructor(
    private elem: ElementRef, 
    private renderer: Renderer2, 
    private shovService: ShovService, 
    private deviceOrientation: DeviceOrientation,
    private device: Device) {
  
    console.log('Device UUID is: ' + this.device.uuid);
    pathURL = pathURL + this.device.uuid;

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
    this.LoadFloorPlan();

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
    this.stage.add(this.wedgelayer);

    this.stage.draw();

    this.renderInterval = setInterval(this.drawStage.bind(this), 16);
    //this.updateInterval = setInterval(this.updateState.bind(this), 500);
    this.updatesubs = shovService.updateStateEvent.subscribe((pos)=>{this.updateState(pos)})
    this.newFloorImageSub = shovService.floorImageEvent.subscribe(()=>{this.LoadFloorPlan()})

    deviceOrientation.watchHeading().subscribe(
      (data: DeviceOrientationCompassHeading) => {
        let nh = -360 - (data.magneticHeading + mapCompassOffset);
        if (this.heading == null) {
          this.heading = nh

       }
        else {

      // get current direction
      let rh = this.heading * Math.PI / 180;
      let nrh = nh * Math.PI / 180;
        var dirx = Math.cos(rh);
        var diry = Math.sin(rh);
        var dx = Math.cos(nrh);
        var dy = Math.sin(nrh);
      // ease the current direction to the target direction
        dirx += (dx - dirx) * 0.25;
        diry += (dy - diry) * 0.25;
          this.heading = Math.atan2(diry, dirx) * 180 / Math.PI;
        }
      }
    );
  }

  ngOnDestroy() {
    clearInterval(this.renderInterval);
    this.updatesubs.unsubscribe();
    this.newFloorImageSub.unsubscribe();
    //clearInterval(this.updateInterval);
    this.stage.destroy();
  }

  updatePath() {

    var pos = this.wedge.position();
    var realpos = toPos(pos)

    console.log(pathURL);
    fetch(pathURL, { method: 'PUT', headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(realpos) })
      .then(res => res.json()) // parse response as JSON (can be res.text() for plain response)
      .then(response => {
        var arr = JSON.parse(response);
        var arrowangle = 180 - (180 * (Math.atan2((arr[3] - arr[1]), (arr[2] - arr[0]))) / Math.PI);

        // here you do what you want with response
        for (var i = 0; i < arr.length; i = i + 2) {
          arr[i] = scaleX(arr[i])
          arr[i + 1] = scaleY(arr[i + 1])
        }

        this.exitpath.points(arr);
        this.exitarrow.position({ x: arr[0], y: arr[1] });

        // console.log(arrowangle);
        this.exitarrow.rotation(arrowangle);
        
      })
      .catch(err => {
        console.log(err)
        alert("sorry, there are no results for your search")
      });

  }

  drawStage() {
    //this.gridlayer.batchDraw();
    this.stage.batchDraw();
    

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
    }.bind(imageObj);
    imageObj.src = mapURL + this.shovService.buildingName + "/" + this.shovService.imageName;
  }


  imageObj:any;
  LoadFloorPlan() {
    this.imageObj = new Image();
    this.imageObj.onload = () => {

      if(this.floorplan) {
        this.floorplan.destroy();
      }      
      this.floorplan = new Konva.Image({
        x: 0,
        y: 0,
        image: this.imageObj,
        width: this.imageObj.width * image_scale * dpi_scale,
        height: this.imageObj.height * image_scale * dpi_scale,
        opacity: 1,
      });
      this.maplayer.add(this.floorplan);
      this.maplayer.draw();
    };
    this.imageObj.src = mapURL + this.shovService.buildingName + "/" + this.shovService.imageName;
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

  updateWedgePos(position) {
    let kpos = toKPos(position);
    this.prevLoc = {x: alphaLoc*kpos.x + (1-alphaLoc)*this.prevLoc.x, y: alphaLoc*kpos.y + (1-alphaLoc)*this.prevLoc.y};
    //this.wedge.position(this.prevLoc);
    
    let x = -this.prevLoc.x + this.stage.offsetX() + this.stage.width()/2
    let y = -this.prevLoc.y + this.stage.offsetY() + this.stage.height()/2
    
    let stageTween = new Konva.Tween({
      node: this.stage,
      x: x,
      y: y,
      offsetX: this.wedge.x(),
      offsetY: this.wedge.y(),
      duration: 0.5
    });

    let wedgeTween = new Konva.Tween({
      node: this.wedge,
      x: this.prevLoc.x,
      y: this.prevLoc.y,
      duration: 0.5
    });

    wedgeTween.play();
    stageTween.play();

    var anim = new Konva.Animation((frame) => {
      this.stage.rotation(this.heading)
      
    }, this.stage);


    anim.start();
    //anim2.start();
  }

  updateState(pos : Vec2) {
    //let pos = this.shovService.pos;
    this.updateWedgePos(pos);
    this.updatePath();
  }

}
