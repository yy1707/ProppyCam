import { NgModule } from '@angular/core';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { HttpClientModule,HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
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
    HammerModule,
    // HttpClient
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, StreamingMedia,
    MediaCapture, VideoEditor, File, HttpClientModule, PhotoViewer],
  bootstrap: [AppComponent],
  exports: [
    
  ]
})
export class AppModule {}
