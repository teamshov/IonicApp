import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AlternateDistancesPage } from './alternate-distances.page';

const routes: Routes = [
  {
    path: '',
    component: AlternateDistancesPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AlternateDistancesPage]
})
export class AlternateDistancesPageModule {}
