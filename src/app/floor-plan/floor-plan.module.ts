import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FloorPlan } from './floor-plan.component';
import { KonvaModule } from 'ng2-konva';


@NgModule({
    declarations: [
        FloorPlan,
    ],
    imports: [
        IonicModule,
        KonvaModule,
    ],
    exports: [
        FloorPlan,
    ],
    entryComponents: [
        FloorPlan,
    ],
})
export class FloorPlanModule {}