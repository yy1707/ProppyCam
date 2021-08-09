import { Component } from '@angular/core';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { ReactiveFormsModule } from '@angular/forms';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  mySrc:any = "";
  videopath = "";
  imgPath = "";

  liveVideopath = "";
  liveVideopath_s = "";
  liveVideopath_thumb = "";

  public appName: string = "ProppyMarket";
  public listingID: string = "PM234984782390912TT";
  public hashTag: string = "My hashtag";

  startTime;
  endTime;

  constructor(
    private toastController: ToastController, private loadingController: LoadingController,
    private streamingMedia: StreamingMedia,
    private mediaCapture: MediaCapture,
    private sanitizer : DomSanitizer,
    private videoEditor: VideoEditor,
    private file: File, 
    private http: HttpClient, 
    private plt:Platform
  ) {  }


  async upload(formData: FormData) {
    this.startTime = Date.now();

    const loading = await this.loadingController.create({
        message: 'Uploading in Progress...',
    });
    await loading.present();
    let params = new URLSearchParams();
    params.set("appName", this.appName);
    params.set("listingID", this.listingID);
    params.set("hashTag", this.hashTag);
    this.http.post("https://cdn.proppyapp.biz/ifile/api/File/Upload?"+params.toString(), formData)
      .pipe(
          finalize(() => {
              loading.dismiss();
              this.endTime = Date.now();
              alert("Upload completed in: " + (this.endTime - this.startTime)/1000 + " seconds");
          })
      )
      .subscribe(res => {
        this.processResult(res);
      });
  }

  processResult(res) {
    this.liveVideopath = res['fileURL'][0];
    this.liveVideopath_s = this.liveVideopath.replace(".mp4", "-s.mp4");
    this.liveVideopath_thumb = this.liveVideopath.replace(".mp4", "-thumb.jpg");
    this.mySrc = this.liveVideopath_thumb;
  }

  async uploadVideo() {    
    if(this.videopath == "") {
      alert("Record a video before uploading it.");
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Preparing upload file...',
    });
    await loading.present();
    const reader = new FileReader();
    this.file.resolveLocalFilesystemUrl(this.videopath)
    .then(entry => {
      ( < FileEntry > entry).file(file => {
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          loading.dismiss();
          const formData = new FormData();
          const vidBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('formFiles', vidBlob, "video.mp4");
            this.upload(formData);
        };
      });          
    })
    .catch(err => {
      alert('Error while reading file.');
    });
    
  }


  playVideo() {
    if(this.liveVideopath == "") {
      alert("Upload a video before playing it from live server.");
      return;
    }
    // alert(this.liveVideopath);
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { alert('Error streaming' + JSON.stringify(e)) },
      //orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };
    
    this.streamingMedia.playVideo(this.liveVideopath, options); 
  }
  // Preview video before upload.
  previewVideo() {
    // alert(this.videopath);
    if(this.videopath == "") {
      alert("Record a video before previewing it.");
      return;
    }
    let options: StreamingVideoOptions = {
      successCallback: () => { console.log('Video played') },
      errorCallback: (e) => { console.log('Error streaming') },
      //orientation: 'landscape',
      shouldAutoClose: true,
      controls: true
    };
    
    this.streamingMedia.playVideo(this.videopath, options); 
  }

  setImgSrc(fileUri) {
    const reader = new FileReader();
    fileUri = (fileUri.includes('file://')?fileUri:'file://'+fileUri);

    this.file.resolveLocalFilesystemUrl(fileUri)
    .then(entry => {
      ( < FileEntry > entry).file(file => {
        reader.readAsDataURL(file);
      });          
    })
    .catch(err => {
      console.log('Error while reading file.');
    });

    reader.onloadend = () => {
      // result includes identifier 'data:image/png;base64,' plus the base64 data
      // alert(reader.result);
      this.mySrc = reader.result;  
    }

  }

  recordVideo() {
    let options = { limit: 1, duration:5 };
    this.mediaCapture.captureVideo(options)
    .then(
      (data: any[]) => {
        // console.log(data); 
        var i, path, len;
        for (i = 0, len = data.length; i < len; i += 1) {
          // console.log(JSON.stringify(data[i]));
          this.videopath = data[i].fullPath;
          this.videopath = (this.videopath.includes('file://')?this.videopath:'file://'+this.videopath);

          this.videoEditor.createThumbnail({
            fileUri: this.videopath,
            outputFileName: 'proppyapp-vidthumb'
          })
          .then((fileUri: string) => {
            // alert('create Thumbnail success: ' + fileUri);
            this.setImgSrc(fileUri);
            
          })
          .catch((error: any) => {
            alert('create Thumbnail error: '+ error);
          });
          // this.streamingMedia.playVideo(path, options);
          // let video:any = document.getElementById("upload-vid");
          // video.src = path;
          // video.play();
          // do something interesting with the file
        }
      },
      (err: CaptureError) => {
        alert(err)
      }
    ); 
  }

  playPreview(event) {
    // alert(event.srcElement.src);
    if (event.srcElement.paused) {
      event.srcElement.play();
    }
    else {
      event.srcElement.pause();
    }
    
  }
}
