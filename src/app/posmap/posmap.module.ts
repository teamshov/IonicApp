import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';
import { PosMap } from './posmap.directive';

@NgModule({
    declarations: [
        PosMap,
    ],
    imports: [
        IonicModule,
        
    ],
    exports: [
        PosMap,
    ],
    providers: [
        DeviceOrientation,
    ]
})
export class PosMapModule {

}