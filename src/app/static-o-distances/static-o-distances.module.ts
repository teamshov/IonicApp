import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { StaticODistancesPage } from './static-o-distances.page';

const routes: Routes = [
  {
    path: '',
    component: StaticODistancesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StaticODistancesPage]
})
export class StaticODistancesPageModule {}
