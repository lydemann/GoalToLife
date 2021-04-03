import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

const firebaseConfig = {
  apiKey: 'AIzaSyCs89L7bIdvZ6ziG6R053mED0f9HHeuEik',
  authDomain: 'productivity-app-28009.firebaseapp.com',
  projectId: 'productivity-app-28009',
  messagingSenderId: '716867576829',
  storageBucket: 'productivity-app-28009.appspot.com',
  appId: '1:716867576829:web:d7475f3051f29c85be2f94',
  measurementId: 'G-T3K1YVTKMX',
};

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
