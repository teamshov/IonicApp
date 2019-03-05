import { EventEmitter, Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
 
interface Window{
  Image:any;
}
declare const window:Window;

@Component({
  selector: 'floorplan',
  template: '<br> <section> <ko-stage [config]="configStage"> <ko-layer> <ko-image [config]="configImage"></ko-image></ko-layer></ko-stage><br></section>'
})
export class FloorPlan implements OnInit {
  public configStage = new BehaviorSubject({
    width: 2000,
    height: 2000,
    draggable: true
  });
  public configImage:EventEmitter<any> = new EventEmitter();

  constructor() { }

  showImage(src: string) {
    const image = new window.Image();
    image.src = src;
    image.onload = () => {
      this.configImage.emit({
        image: image,
      })
    }
  }

  ngOnInit() {
    this.showImage("http://omaraa.ddns.net:62027/db/buildings/eb2/floor1.png");
  }

}
