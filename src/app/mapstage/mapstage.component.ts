import { Component, OnInit } from '@angular/core';
import Konva from 'konva';
import { DeviceOrientation, DeviceOrientationCompassHeading } from '@ionic-native/device-orientation/ngx';
import { KonvaComponent } from 'ng2-konva';
 
const scale_y = -11.2;
const scale_x = 10.9;
const origin_x = 307;
const origin_y = 554;
const dO = new DeviceOrientation();
var stage:any;

@Component({
  selector: 'mapstage',
  template: '<div id="mapstage"></div>'
})
export class MapStage implements OnInit {


  ngOnInit() {
     stage =  new Konva.Stage({
      container: 'mapstage',
      width: innerWidth,
      height: innerHeight,
      draggable: true
    }
    );
  
    var maplayer = new Konva.Layer({});
    this.setFloorplan(maplayer);

    var gridlayer = new Konva.Layer({});
    this.setGrid(gridlayer);

    console.log("Container created");
    stage.add(gridlayer);

    stage.add(maplayer);
    stage.draw();
  }

  drawStage() {
    // while(true){
      // setTimeout(() => {
        dO.getCurrentHeading().then(
          (data: DeviceOrientationCompassHeading) => {
            stage.rotation(360 - (data.magneticHeading - 50));
            stage.position({x: 0, y: 0});
          },
          (error: any) => console.log(error)
        );
    stage.draw();
      // }, 1000
      
      // );
    // }
  }

  setFloorplan(bglayer) {

    var imageObj = new Image()
    imageObj.onload = function() {
        var floorplan = new Konva.Image({
          x: 0,
          y: 0,
          image: this,
          width: imageObj.width,
          height: imageObj.height,
          opacity: 0.5,
        });
        bglayer.add(floorplan);
        bglayer.draw();
    };
    imageObj.src = "http://omaraa.ddns.net:62027/db/buildings/eb2/floor1.png"
  }

  setGrid(gridlayer) {
    var grid = new Array(30);
    for(var i = 0; i < 30; i++) {
      grid[i] = new Array(30);
    }
  
    for(var x = 0; x < 30; x++) {
      for(var y = 0; y < 30; y++) {
        var upos = {x:x, y:y};
        var value = 0;
  
        grid[x][y] = new Konva.Rect(
          {
            x:this.scaleX(x),
            y:this.scaleY(y)-10,
            width:10,
            height:10,
            fill: 'black'
          }
        );
  
          gridlayer.add(grid[x][y]);
      }
    }
    gridlayer.batchDraw();
  }
  
  scaleX(x) {
    return x*scale_x + origin_x;
  }
  
  scaleY(y) {
    return y*scale_y + origin_y;
  }
}
