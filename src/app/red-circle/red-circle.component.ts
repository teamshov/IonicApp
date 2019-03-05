import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
 
@Component({
  selector: 'red-circle',
  template: '<br> <section> <ko-stage [config]="configStage"> <ko-layer> <ko-circle [config]="configCircle"></ko-circle></ko-layer></ko-stage><br></section>'
})
export class RedCircle implements OnInit {
  public configStage = new BehaviorSubject({
    width: 200,
    height: 200
  });
  public configCircle: Observable<any> = of({
    x: 100,
    y: 100,
    radius: 70,
    fill: 'red',
    stroke: 'black',
    strokeWidth: 4
  });

  ngOnInit() {
    console.log("redcircle");
    setTimeout(() => {
      this.configStage.next({
        width: 500,
        height: 200
      });
    }, 1000);
  }

}
