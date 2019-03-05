import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, Platform } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { HomePage } from './home.page';

import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { RedCircleModule } from '../red-circle/red-circle.module';
import { FloorPlanModule } from '../floor-plan/floor-plan.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RedCircleModule,
    FloorPlanModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  providers: [
    BluetoothLE
  ],
  declarations: [HomePage]
})
export class HomePageModule {
  

}
