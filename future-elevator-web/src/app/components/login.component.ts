import { CourseService } from './../services/course.service';
import { UserInfoService } from './../services/user-info.service';
import { environment } from './../../environments/environment';
import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
declare var ImageCapture;
declare var window;
var MediaStream = window.MediaStream;

// if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
//     MediaStream = webkitMediaStream;
// }

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
    MediaStream.prototype.stop = function() {
        this.getAudioTracks().forEach(function(track) {
            track.stop();
        });

        this.getVideoTracks().forEach(function(track) {
            track.stop();
        });
    };
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {

  video: HTMLVideoElement;
  imageCapture;
  stream: MediaStream;
  loginStatus = false;

  videoDisplay = 'none';
  loginInterval;

  message = '正在识别人脸登录...';
  constructor(
    private router: Router,
    private userInfo: UserInfoService,
    private courseService: CourseService
  ) { }

  ngOnInit() {
    
    this.courseService.user()
      .subscribe(res => {
        if(res['success']) {
          const st = res['value'];
          console.log('登录成功:',st)
          this.message = '认证成功';
        this.userInfo.update(st);
          // this.stream.stop();

          setTimeout(()=>{
          this.router.navigate(['/ui']);
              
          },500);
        }
      })
  }


  ngAfterViewInit(){
    const constraints = {
      video: true
    };
      this.video = document.querySelector('#screenshot-video');
    
    
   

    
      navigator.mediaDevices.getUserMedia(constraints).
          then((stream)=>{
            this.video.srcObject = stream;
            this.stream = stream;
            let mediaStreamTrack = stream.getVideoTracks()[0];
            this.imageCapture = new ImageCapture(mediaStreamTrack);
          }).catch((err)=>{
              console.error(err);
          });
  }

  start_login(){
    this.loginStatus = true;
    this.videoDisplay = "";
    this.login();
  }

  login(){
    this.message = '正在识别人脸登录...';
    this.imageCapture.takePhoto()
    .then(blob => {
        //let url = window.URL;
        //this.img.src = url.createObjectURL(blob);
        console.log('blob:',blob);
        //globalBlob = blob;
        // img.setAttribute('blob',blob);
        this.detectFace(blob);
        //url.revokeObjectURL(blob);
    })
    .catch(error =>{
      console.error(error);
    });

    // setTimeout(()=>{
    //   this.router.navigate(['/ui']);
    // },1000);
  }

   /** 
     * 人脸检测
     * 
     * */
    detectFace(blob) {
      var url = environment.apiUrl +"api/course/login_by_face";
      var fd = new FormData();
      fd.append('file', blob);

      fetch(url, {
          method: "POST",
          body: fd,
          credentials: 'include'
      }).then(response => response.json())
          .then(json => {
              if(json.success) {
                  const st = json['value'];
                console.log('登录成功:',st)
                this.message = '认证成功';
              this.userInfo.update(st);
                this.stream.stop();

                setTimeout(()=>{
                this.router.navigate(['/ui']);
                    
                },500);
                 
              } else {
                this.message = '认证失败，正在重试...';
                setTimeout(()=>{
                  this.login();
                },1000);
                console.log('登录失败');
              }
              
              //start();
          })

  }


  ngOnDestroy(){

    try{
      this.stream.stop();
    clearInterval(this.loginInterval);
    } catch(e) {

    }
    
  }

}
