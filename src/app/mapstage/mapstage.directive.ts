import { Directive, ElementRef, Renderer2, OnDestroy, Input } from '@angular/core';
import Konva from 'konva';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { KonvaComponent } from 'ng2-konva';
import { ShovService } from '../shov.service';

const pixel_to_meters_scale = 4.697624908;
const dpi_scale = 96/1080;
const image_scale = 3;
const origin_x = 0.32;
const origin_y = 264.18;
const dO = new DeviceOrientation();
const alpha = 0.5;

@Directive({
  selector: '[mapstage]',
})
export class MapStage implements OnDestroy{


  maplayer: any;
  gridlayer: any;
  wedgelayer: any;
  stage: any;
  floorplan: any;
  grid: any;
  heading: number = null;
  wedge: any;

  updateCompassInterval: any;
  updateGridInterval: any;
  constructor(elem: ElementRef, renderer: Renderer2, private shovService: ShovService) {
    renderer.addClass(elem.nativeElement, 'konva');
    this.stage =  new Konva.Stage({
      container: elem.nativeElement,
      width: innerWidth,
      height: innerHeight,
      draggable: true
    }
    );

    console.log('Stage Constructed');

    this.maplayer = new Konva.Layer({});
    this.setFloorplan(this.maplayer, this.floorplan);

    this.gridlayer = new Konva.Layer({});
    this.setGrid(this.gridlayer);

    this.wedgelayer = new Konva.Layer({});
    this.setWedge(this.wedgelayer);

    // this.stage.add(this.gridlayer);
    this.stage.add(this.maplayer);
    this.stage.add(this.wedgelayer);

    this.stage.draw();

    this.updateCompassInterval = setInterval(this.drawStage.bind(this), 16);
    this.updateGridInterval = setInterval(this.updateState.bind(this), 500);
    // console.log("input-box keys  : ", this.str1);
  }

  destroy() {
    clearInterval(this.updateCompassInterval);
    console.log('Stage destroyed');
    this.stage.destroy();
  }

  drawStage() {
    // this.updateState();
    // dO.getCurrentHeading().then(
    //   (data: DeviceOrientationCompassHeading) => {
    //     if(this.heading == null) this.heading = 360 - (data.magneticHeading + 40);
    //     else this.heading = alpha*(360 - (data.magneticHeading + 40)) + (1-alpha)*this.heading;
    //     this.rotateNode(this.stage, this.heading);
    //   },
    //   (error: any) => console.log(error)
    // );
    this.gridlayer.batchDraw();
    // this.wedgelayer.batchDraw();
  }

  setFloorplan(bglayer, floorplan) {

    let imageObj = new Image();
    imageObj.onload = function() {
        floorplan = new Konva.Image({
          x: 0,
          y: 0,
          image: this,
          width: imageObj.width*image_scale*dpi_scale,
          height: imageObj.height*image_scale*dpi_scale,
          opacity: 1,
        });
        bglayer.add(floorplan);
        bglayer.draw();
    };
    imageObj.src = 'http://omaraa.ddns.net:62027/db/buildings/eb2/L1_1.png';
  }

  setGrid(gridlayer) {
    this.grid = new Array(40);
    for(let i = 0; i < 40; i++) {
      this.grid[i] = new Array(36);
    }

    for(let x = 0; x < 40; x++) {
      for(let y = 0; y < 36; y++) {
        this.grid[x][y] = new Konva.Rect(
          {
            x: this.scaleX(x),
            y: this.scaleY(y),
            width: 10,
            height: 10,
            fill: 'black',
          }
        );
        gridlayer.add(this.grid[x][y]);
      }
    }
    gridlayer.batchDraw();
  }

  setWedge(wedgelayer){
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

  drawWedgePos(position){
    this.wedge.position(position);
    dO.getCurrentHeading().then(
    (data: DeviceOrientationCompassHeading) => {
      if(this.heading == null) this.heading = 360 - (data.magneticHeading + 40);
      else this.heading = alpha*(360 - (data.magneticHeading + 40)) + (1-alpha)*this.heading;
      this.wedge.rotation(this.heading);
    },(error: any) => console.log(error)
    );
  }

  // toKonvaCoords()
  scaleX(x) {
    return image_scale * (x * pixel_to_meters_scale + origin_x);
  }

  scaleY(y) {
    return image_scale * (y * (-pixel_to_meters_scale) + origin_y);
  }

  rotateNode(node, rotation) {
    //copied from https://github.com/konvajs/konva/issues/26#issuecomment-438816017
    const degToRad = Math.PI / 180;

    const rotatePoint = ({x, y}, deg) => {
        const rcos = Math.cos(deg * degToRad), rsin = Math.sin(deg * degToRad);
        return {x: x * rcos - y * rsin, y: y * rcos + x * rsin};
    };

    //current rotation origin (0, 0) relative to desired origin - center (node.width()/2, node.height()/2)
    const topLeft = {x: -node.width() / 2, y: -node.height() / 2};
    const current = rotatePoint(topLeft, node.rotation());
    const rotated = rotatePoint(topLeft, rotation);
    const dx = rotated.x - current.x, dy = rotated.y - current.y;

    node.rotation(rotation);
    node.x(node.x() + dx);
    node.y(node.y() + dy);
  }

  ngOnDestroy() {
    clearInterval(this.updateCompassInterval);
    clearInterval(this.updateGridInterval);
    this.stage.destroy();
  }

  probabilityFunc(upos, bpos, mean, std) {
    let dist = Math.sqrt((upos.x - bpos.x) ** 2 + (upos.y - bpos.y) ** 2);
    let A = Math.exp(-((dist - mean) ** 2) / (2 * (std) ** 2));
    let B = 1 / (std * Math.sqrt(2 * Math.PI));
    return A * B;
  }

  heatMapColorforValue(value) {
    let h = (1.0 - value) * 240;
    return ('hsl(' + h + ', 100%, 50%)');
  }

  updateState() {
    let max = 0;
    let mxx = 0;
    let myy = 0;
    for(let x = 0; x < 40; x++) {
      for(let y = 0; y < 36; y++) {
        let gridCell = {x: x, y: y};
        let value = 0;
        let beacons = this.shovService.getBeacons();
        for(let i = 0; i < beacons.length; i++) {
          let x2 = beacons[i].getXpos();
          let y2 = beacons[i].getYpos();
          let distance = beacons[i].getDistance();
          if(typeof(distance) != 'number' || isNaN(distance)) {
            continue;
          }
          let beaconpos = {x: x2, y: y2};
          value += this.probabilityFunc(gridCell, beaconpos, distance, distance);

        }
        if (value > max) {
         mxx = x;
         myy = y;
         max = value;
        }
        // this.grid[x][y].fill(this.heatMapColorforValue(value));

      }
    }
    // this.grid[mxx][myy].fill('red');
    this.drawWedgePos(this.grid[mxx][myy].position());
    console.log(mxx + ', ' + myy);

  }

}
