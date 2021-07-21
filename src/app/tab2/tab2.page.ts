import { Component } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private streamingMedia: StreamingMedia) {}


  playPreview(event) {
    console.log(event);
    if (event.toElement.paused) {
      event.toElement.play();
    }
    else {
      event.toElement.pause();
    }
    
  }


  // Playing a video.
  playVid(video) {
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      //orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };
    
    this.streamingMedia.playVideo(video, options); 
  }
}
