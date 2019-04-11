import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { Home } from './home.page';

import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { MapStage } from '../mapstage/mapstage.directive';
import { MapStageModule } from '../mapstage/mapstage.module';
//import { PinchZoomModule } from 'ngx-pinch-zoom';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapStageModule,
    //PinchZoomModule,
    RouterModule.forChild([
      {
        path: '',
        component: Home
      }
    ])
  ],
  providers: [
    BluetoothLE
  ],
  declarations: [Home]
})
export class HomePageModule {
  

}
