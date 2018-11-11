import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { CourseService } from '../services/course.service';
import { environment } from '../../environments/environment';
import { NzNotificationService } from 'ng-zorro-antd';


declare var ImageCapture;
declare var window;
var MediaStream = window.MediaStream;

// if (typeof MediaStream === 'undefined' && typeof webkitMediaStream !== 'undefined') {
//     MediaStream = webkitMediaStream;
// }

/*global MediaStream:true */
if (typeof MediaStream !== 'undefined' && !('stop' in MediaStream.prototype)) {
  MediaStream.prototype.stop = function () {
    this.getAudioTracks().forEach(function (track) {
      track.stop();
    });

    this.getVideoTracks().forEach(function (track) {
      track.stop();
    });
  };
}
@Component({
  selector: 'app-face',
  templateUrl: './face.component.html',
  styleUrls: ['./face.component.less']
})
export class FaceComponent implements OnInit, AfterViewInit, OnDestroy {

  video: HTMLVideoElement;
  imageCapture;
  stream: MediaStream;

  selectStudent: any;
  selectTrainStudent: any;
  identifyStudent: any;

  identifyResult = true;
  identifyMessage = "";
  students = [];
  students_untrain = [];
  students_train = [];
  constructor(
    private courseService: CourseService,
    private notication: NzNotificationService
  ) { }


  findTrainStudent(personId) {

    for (let index = 0; index < this.students_train.length; index++) {
      const st = this.students_train[index];
      if (st['personId'] == personId) {
        return true;
      }
    }

    return false;
  }

  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this.courseService.users()
      .subscribe(res => {
        console.log('学生数据:{}', res);
        if (res['success']) {
          this.students = res['list'];
          this.students_untrain = res['list'];
        }
      });

    this.courseService.usersTrain()
      .subscribe(res => {
        if (res['success']) {
          this.students_train = res['list'];

          for (let index = 0; index < this.students_untrain.length; index++) {
            const st = this.students_untrain[index];

            if (this.findTrainStudent(st['personId'])) {
              this.students_untrain.splice(index, 1);
              index--;
              continue
            }

          }

        }
      })
  }

  ngAfterViewInit() {
    const constraints = {
      video: true
    };
    this.video = document.querySelector('#screenshot-video');





    navigator.mediaDevices.getUserMedia(constraints).
      then((stream) => {
        this.video.srcObject = stream;
        this.stream = stream;
        let mediaStreamTrack = stream.getVideoTracks()[0];
        this.imageCapture = new ImageCapture(mediaStreamTrack);
      }).catch((err) => {
        console.error("mediaDevices error",err);
      });
  }
  /** 
    * 人脸检测
    * 
    * */
  detectFace(blob) {
    this.identifyMessage = '';

    var url = environment.apiUrl + "api/face/detect";
    var fd = new FormData();
    fd.append('file', blob);

    fetch(url, {
      method: "POST",
      body: fd
    }).then(response => response.json())
      .then(json => {
        if (json.success) {
          var list = json.list || [];

          if (list.length > 0) {

            const personId = list[0].person_id;
            if (list[0].confidence > 90) {


              console.log('检测成功:', personId)
              this.students.forEach(student => {
                if (personId == student['personId']) {
                  this.identifyStudent = student;
                }
              })
              this.students_train.forEach(student => {
                if (personId == student['personId']) {
                  this.identifyStudent = student;
                }
              })
              //this.stream.stop();
              //this.router.navigate(['/dashboard']);
            } else {
              this.identifyResult = false;
              console.log('confidence 不足:', list[0].confidence);
            }

            let confidences= [];
            for (let index = 0; index < list.length; index++) {
              const element = list[index];
              confidences.push(element['confidence'])
              
            }
            let temp = confidences.join();
            this.identifyMessage = `检测结果 -> 识别数量:${list.length},confidences: ${temp}`;


          } else {
            this.identifyResult = false;
          }
          console.log('face:', list);
        }

        //start();
      })

  }


  trainFace(blob, student) {
    var url = environment.apiUrl + "api/course/train_face";
    var fd = new FormData();
    fd.append('file', blob);
    fd.append('personId', student['personId']);
    fd.append('name', student['name']);

    fetch(url, {
      method: "POST",
      body: fd
    }).then(response => response.json())
      .then(json => {
        if (json.success) {
          console.log('训练结束');
          this.notication.info('提示', '更新数据完成');
          this.loadData();
        }

        //start();
      })
  }

  train() {
    this.imageCapture.takePhoto()
      .then(blob => {
        //let url = window.URL;
        //this.img.src = url.createObjectURL(blob);
        console.log('blob:', blob);
        //globalBlob = blob;
        // img.setAttribute('blob',blob);
        this.trainFace(blob, this.selectStudent);
        //url.revokeObjectURL(blob);
      })
      .catch(error => {
        console.error(error);
      });
  }

  train_extra() {
    if (!this.selectTrainStudent) {
      console.log('请选择已训练人员');
      this.notication.warning('提示', '请选择已训练人员');
      return;
    }
    this.imageCapture.takePhoto()
      .then(blob => {
        //let url = window.URL;
        //this.img.src = url.createObjectURL(blob);
        console.log('blob:', blob);
        //globalBlob = blob;
        // img.setAttribute('blob',blob);
        this.trainFace(blob, this.selectTrainStudent);
        //url.revokeObjectURL(blob);
      })
      .catch(error => {
        console.error(error);
      });

  }


  identify() {
    this.identifyStudent = null;
    this.identifyResult = true;
    this.imageCapture.takePhoto()
      .then(blob => {
        //let url = window.URL;
        //this.img.src = url.createObjectURL(blob);
        console.log('blob:', blob);
        //globalBlob = blob;
        // img.setAttribute('blob',blob);
        this.detectFace(blob);
        //url.revokeObjectURL(blob);
      })
      .catch(error => {
        console.error(error);
      });
  }

  delete() {
    if (!this.selectTrainStudent) {
      console.log('请选择已训练人员');
      this.notication.warning('提示', '请选择已训练人员');
      return;
    }

    this.courseService.deleteFace(this.selectTrainStudent['personId'])
      .subscribe(res => {
        if (res['success']) {
          this.notication.info('提示', '删除人脸数据成功');
          this.selectTrainStudent = null;
          this.loadData();
        }
      })
  }

  ngOnDestroy() {
    this.stream.stop();
  }
}
