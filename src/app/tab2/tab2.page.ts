import { Component } from '@angular/core';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  constructor(private streamingMedia: StreamingMedia) {}

  onGesture(str) {
    alert("Open Property Detail page.");
  }

  playPreview(event) {
    console.log(event.srcEvent.srcElement);
    if (event.srcEvent.srcElement.paused) {
      event.srcEvent.srcElement.play();
    }
    else {
      event.srcEvent.srcElement.pause();
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
