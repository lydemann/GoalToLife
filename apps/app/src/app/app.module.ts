import { TagInputModule } from 'ngx-chips';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocalStorageModule } from 'angular-2-local-storage';

import {
  Endpoints,
  ENDPOINTS_TOKEN,
  GraphQLModule,
} from '@app/app-lib/shared/domain';
import { AkitaNgDevtools } from '@datorama/akita-ngdevtools';
import { AkitaNgRouterStoreModule } from '@datorama/akita-ng-router-store';
import { SharedFeatureAuthModule } from '@app/shared/domain-auth';
import { environment } from '../environments/environment';

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

export function endpointsFactory() {
  return {
    serviceUrl: environment.serviceUrl,
  } as Endpoints;
}

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    TagInputModule,
    GraphQLModule,
    HttpClientModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    LocalStorageModule.forRoot({
      prefix: 'my-app',
      storageType: 'localStorage',
    }),
    environment.production ? [] : AkitaNgDevtools.forRoot(),
    AkitaNgRouterStoreModule,
    SharedFeatureAuthModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: ENDPOINTS_TOKEN,
      useFactory: endpointsFactory,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
