import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'List',
      url: '/list',
      icon: 'list'
    },
    {
      title: 'Static O Distances',
      url: '/static-o-distances',
      icon: 'walk'
    },
    {
      title: 'Pi O Distances',
      url: '/pi-o-distances',
      icon: 'walk'
    },
    {
      title: 'Alternate Distances',
      url: '/alternate-distances',
      icon: 'walk'
    },
    {
      title: 'Test Page',
      url: '/test',
      icon: 'thermometer'
    }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();

      // this.splashScreen.hide();
    });
  }
}
