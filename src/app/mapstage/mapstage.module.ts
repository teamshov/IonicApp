import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapStage } from './mapstage.directive';

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
})
export class MapStageModule {

}