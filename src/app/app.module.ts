import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { BluetoothLE } from '@ionic-native/bluetooth-le/ngx';
import { KonvaModule } from 'ng2-konva';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { BackgroundMode } from '@ionic-native/background-mode/ngx';
import { Device } from '@ionic-native/device/ngx';
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    KonvaModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    BluetoothLE,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    LocalNotifications,
    BackgroundMode,
    Device
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
