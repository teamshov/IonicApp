import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { RedCircle } from './red-circle.component';
import { KonvaModule } from 'ng2-konva';


@NgModule({
    declarations: [
        RedCircle,
    ],
    imports: [
        IonicModule,
        KonvaModule,
    ],
    exports: [
        RedCircle,
    ],
    entryComponents: [
        RedCircle,
    ],
})
export class RedCircleModule {}