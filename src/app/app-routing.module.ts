import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  {
    path: 'static-o-distances', 
    loadChildren: './static-o-distances/static-o-distances.module#StaticODistancesPageModule' 
  },
  { 
    path: 'pi-o-distances', 
    loadChildren: './pi-o-distances/pi-o-distances.module#PiODistancesPageModule' 
  },
  { path: 'alternate-distances', loadChildren: './alternate-distances/alternate-distances.module#AlternateDistancesPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
