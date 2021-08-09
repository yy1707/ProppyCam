import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Tab1Page } from './tab1.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { Tab1PageRoutingModule } from './tab1-routing.module';

import { File } from '@ionic-native/File/ngx';
import { HttpClientModule } from '@angular/common/http';
// import {VgCoreModule} from '@videogular/ngx-videogular/core';
// import {VgControlsModule} from '@videogular/ngx-videogular/controls';
// import {VgOverlayPlayModule} from '@videogular/ngx-videogular/overlay-play';
// import {VgBufferingModule} from '@videogular/ngx-videogular/buffering';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    Tab1PageRoutingModule,
    HttpClientModule
    // VgCoreModule,
    // VgControlsModule,
    // VgOverlayPlayModule,
    // VgBufferingModule
  ],
  providers: [
    File
  ],
  declarations: [Tab1Page]
})
export class Tab1PageModule {}
