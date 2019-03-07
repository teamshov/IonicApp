import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MapStage } from './mapstage.component';
import { KonvaModule } from 'ng2-konva';


@NgModule({
    declarations: [
        MapStage,
    ],
    imports: [
        IonicModule,
        KonvaModule,
    ],
    exports: [
        MapStage,
    ],
    entryComponents: [
        MapStage,
    ],
})
export class MapStageModule {}