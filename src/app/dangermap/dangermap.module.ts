import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { DangermapPage } from './dangermap.page';
import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { MapStage } from '../mapstage/mapstage.directive';
import { MapStageModule } from '../mapstage/mapstage.module';

const routes: Routes = [
  {
    path: '',
    component: DangermapPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MapStageModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    BluetoothLE,
  ],
  declarations: [DangermapPage]
})
export class DangermapPageModule {}
