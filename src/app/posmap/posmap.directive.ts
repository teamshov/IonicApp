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
  selector: '[posmap]',
})
export class PosMap implements OnDestroy {
  UID:any;
  DID: any;

  maplayer: any;
  toplayer: any;
  dot: any;
  simpleText: any;
  stage: any;
  floorplan: any;

  width: any;
  height: any;

  constructor(
    private elem: ElementRef, 
    private renderer: Renderer2, 
    private shovService: ShovService) {

        this.width = 300;
        this.height = 300;
  
    renderer.addClass(elem.nativeElement, 'konva');
    this.stage = new Konva.Stage({
      container: elem.nativeElement,
      width: this.width,
      height: this.height,
    }
    );
    // this.stage.on('tap', () => this.drawPath());

    console.log('Stage Constructed');

    this.maplayer = new Konva.Layer({});
    this.LoadFloorPlan();
    this.stage.add(this.maplayer);

    this.toplayer = new Konva.Layer({});
    this.dot = new Konva.Circle({
        x: this.width/2,
        y: this.height/2,
        radius: 4,
        fill: "red",
        stroke: "back",
        strokeWidth: 2

    })
    this.simpleText = new Konva.Text({
        x: 15,
        y: 15,
        text: 'xpos: ypos: ',
        fontSize: 8,
        fontFamily: 'Calibri',
        fill: 'green'
      });
    this.toplayer.add(this.dot);
    this.toplayer.add(this.simpleText);
    this.stage.add(this.toplayer);

    this.stage.draw();
  }

  ngOnDestroy() {
    this.stage.destroy();
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
        draggable: true
      });

      this.floorplan.on("dragmove", ()=>this.onDrag())
      this.maplayer.add(this.floorplan);
      this.maplayer.draw();
    };
    this.imageObj.src = mapURL + "eb2" + "/" + "L1_Black.png";
  }

  onDrag() {
      let kpos: Vec2 = {x: -(this.floorplan.x() - this.width/2), y: -(this.floorplan.y() - this.height/2)}
      let rpos = toPos(kpos);
      this.simpleText.text("xpos:" + rpos.x + " ypos:" + rpos.y)
      this.stage.draw();

      this.shovService.testPos = rpos;
  }
  
}
