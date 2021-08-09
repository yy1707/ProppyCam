import { Component } from '@angular/core';
import { ActionSheetController, ToastController, Platform, LoadingController } from '@ionic/angular';
import { StreamingMedia, StreamingVideoOptions } from '@ionic-native/streaming-media/ngx';
import { MediaCapture, MediaFile, CaptureError, CaptureImageOptions } from '@ionic-native/media-capture/ngx';
import { VideoEditor } from '@ionic-native/video-editor/ngx';
import { DomSanitizer } from '@angular/platform-browser';
import { File, FileEntry } from '@ionic-native/File/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { ReactiveFormsModule } from '@angular/forms';
import { LiteralMapEntry } from '@angular/compiler/src/output/output_ast';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  mySrc:any = "";
  imgPath = "";

  liveImagepath = "";

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
    private plt:Platform,
    private photoViewer: PhotoViewer
  ) {}

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
    this.liveImagepath = res['fileURL'][0];
    this.mySrc = null;
    this.mySrc = this.liveImagepath;
  }

  async uploadPhoto() {    
    if(this.imgPath == "") {
      alert("Take a photo before uploading it.");
      return;
    }
    const loading = await this.loadingController.create({
      message: 'Preparing upload file...',
    });
    await loading.present();
    const reader = new FileReader();
    this.file.resolveLocalFilesystemUrl(this.imgPath)
    .then(entry => {
      ( < FileEntry > entry).file(file => {
        reader.readAsArrayBuffer(file);
        reader.onload = () => {
          loading.dismiss();
          const formData = new FormData();
          const imgBlob = new Blob([reader.result], {
                type: file.type
            });
            formData.append('formFiles', imgBlob, "img.jpg");
            this.upload(formData);
        };
      });          
    })
    .catch(err => {
      alert('Error while reading file.');
    });
    
  }


  playPhoto() {
    if(this.liveImagepath == "") {
      alert("Upload a photo before display it from live server.");
      return;
    }
    // alert(this.liveImagepath);
    this.photoViewer.show(this.liveImagepath);
  }
  // Preview video before upload.
  previewPhoto() {
    // alert(this.imgPath);
    if(this.imgPath == "") {
      alert("Take a photo before previewing it.");
      return;
    }
    this.photoViewer.show(this.imgPath);
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

  takePhoto() {
    let options = { limit: 1 };
    this.mediaCapture.captureImage(options)
    .then(
      (data: any[]) => {
        // console.log(data); 
        var i, path, len;
        for (i = 0, len = data.length; i < len; i += 1) {
          // console.log(JSON.stringify(data[i]));
          this.imgPath = data[i].fullPath;
          this.imgPath = (this.imgPath.includes('file://')?this.imgPath:'file://'+this.imgPath);
          this.setImgSrc(this.imgPath);
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