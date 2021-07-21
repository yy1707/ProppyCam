import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { StreamingMedia } from '@ionic-native/streaming-media/ngx';

// import {VgCoreModule} from '@videogular/ngx-videogular/core';
// import {VgControlsModule} from '@videogular/ngx-videogular/controls';
// import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
// import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, StreamingMedia],
  bootstrap: [AppComponent],
})
export class AppModule {}
