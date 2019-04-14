import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapStage } from './mapstage.directive';
import { DeviceOrientation } from '@ionic-native/device-orientation/ngx';

@NgModule({
    declarations: [
        MapStage,
    ],
    imports: [
        IonicModule,
        
    ],
    exports: [
        MapStage,
    ],
    providers: [
        DeviceOrientation,
    ]
})
export class MapStageModule {

}