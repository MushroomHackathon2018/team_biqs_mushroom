import { SectionSceneComponent } from './sections/section-scene.component';
import { SectionFloorComponent } from './sections/section-floor.component';
import {Component, OnInit, ViewChild} from '@angular/core';

import {SectionTitleComponent} from './sections/section-title.component';
import { SectionInfoComponent } from './sections/section-info.component';

declare var Leap;
@Component({
  selector: 'app-ui-component',
  templateUrl: './ui-component.component.html',
  styleUrls: ['./ui-component.component.less']
})
export class UiComponentComponent implements OnInit {
  /**
   * 步骤 0 为起始交互界面
   * 1 为 楼层选择界面
   * 2 为 场景选择界面
   * 3 为 信息展示界面
   */
  step = 0;
  constructor() {}

  points = [];


  @ViewChild('title') title: SectionTitleComponent;

  @ViewChild('floor')  floor: SectionFloorComponent;

  @ViewChild('scene')  scene: SectionSceneComponent;

  @ViewChild('info')  info: SectionInfoComponent;

  ngOnInit() {
    console.log(' leap:', Leap);


    function moveFinger(Finger, posX, posY, posZ) {
      Finger.style.webkitTransform =
          'translate3d(' + posX + 'px, ' + posY + 'px, ' + posZ + 'px)';
    }

    function moveSphere(Sphere, posX, posY, posZ, rotX, rotY, rotZ) {
      Sphere.style.webkitTransform = Sphere.style.mozTransform =
          Sphere.style.transform = 'translateX(' + posX + 'px) translateY(' +
          posY + 'px) translateZ(' + posZ + 'px) rotateX(' + rotX +
          'deg) rotateY(0deg) rotateZ(0deg)';
    }

    var fingers = {};
    var spheres = {};
    Leap.loop({enableGestures:true},(frame) => {
      var seenFingers = {};
      var handIds = {};
      var handsLength;
      if (frame.hands === undefined) {
        handsLength = 0
      } else {
        handsLength = frame.hands.length;
      }

      for (var handId = 0, handCount = handsLength; handId != handCount;
           handId++) {
        var hand = frame.hands[handId];
        var posX = (hand.palmPosition[0] * 3);
        var posY = (hand.palmPosition[2] * 3) - 200;
        var posZ = (hand.palmPosition[1] * 3) - 400;
        var rotX = (hand._rotation[2] * 90);
        var rotY = (hand._rotation[1] * 90);
        var rotZ = (hand._rotation[0] * 90);
        var sphere = spheres[hand.id];
        var sphereDiv;
        // if (!sphere) {
        //   sphereDiv = document.getElementById('sphere').cloneNode(true);
        //   sphereDiv.setAttribute('id', hand.id);
        //   sphereDiv.style.backgroundColor =
        //       '#' + Math.floor(Math.random() * 16777215).toString(16);
        //   document.getElementById('scene').appendChild(sphereDiv);
        //   spheres[hand.id] = hand.id;
        // } else {
        //   sphereDiv = document.getElementById(hand.id);
        //   if (typeof (sphereDiv) != 'undefined' && sphereDiv != null) {
        //     moveSphere(sphereDiv, posX, posY, posZ, rotX, rotY, rotZ);
        //   }
        // }
        handIds[hand.id] = true;
      }
      for (var handIdInner in spheres) {
        if (!handIds[handIdInner]) {
          sphereDiv = document.getElementById(spheres[handId]);
          if (sphereDiv && sphereDiv.parentNode) {
            sphereDiv.parentNode.removeChild(sphereDiv);
          }
          delete spheres[handId];
        }
      }

      for (var pointableId = 0, pointableCount = frame.pointables.length;
           pointableId != pointableCount; pointableId++) {
        var pointable = frame.pointables[pointableId];
        var newFinger = false;
        if (pointable.finger) {
          if (!fingers[pointable.id]) {
            fingers[pointable.id] = [];
            newFinger = true;
          }

          for (var partId = 0, length; partId != 4; partId++) {
            var posX = (pointable.positions[partId][0] * 3);
            var posY = (pointable.positions[partId][2] * 3) - 200;
            var posZ = (pointable.positions[partId][1] * 3) - 400;

            var id = pointable.id + '_' + partId;
            // console.log('id:',id);

            var finger = fingers[id];
            var fingerDiv;
            if (newFinger) {
              fingerDiv = document.getElementById('finger').cloneNode(true);
              fingerDiv.setAttribute('id', id);
              fingerDiv.style.backgroundColor =
                  '#' + Math.floor(pointable.type * 500).toString(16);

              if (pointable.type == 1 && partId == 3) {
                // console.log('食指')

                fingerDiv.style.backgroundColor = '#000';
                fingerDiv.style.opacity = 0;
                document.getElementById('scene').appendChild(fingerDiv);
                
              }
            
           
              fingers[pointable.id].push(id);
            } else {
              fingerDiv = document.getElementById(id);
              if (typeof (fingerDiv) != 'undefined' && fingerDiv != null) {
                moveFinger(fingerDiv, posX, posY, posZ);

                if (pointable.type == 1 && partId == 3) {
                  var offsets = fingerDiv.getBoundingClientRect();
                  var top = offsets.top;
                  var left = offsets.left;
                  this.handleCursor({top, left})
                  // console.log('食指：',left,top);
                  // console.log('els',els);
                }
              }
            }
            seenFingers[pointable.id] = true;
          }

          // var dirX = -(pointable.direction[1]*90);
          // var dirY = -(pointable.direction[2]*90);
          // var dirZ = (pointable.direction[0]*90);
        }
      }
      for (var fingerId in fingers) {
        if (!seenFingers[fingerId]) {
          var ids = fingers[fingerId];
          for (var index in ids) {
            fingerDiv = document.getElementById(ids[index]);
            if(fingerDiv && fingerDiv.parentNode) {
               fingerDiv.parentNode.removeChild(fingerDiv);

            }
          }
          delete fingers[fingerId];
        }
      }

   

      if (handsLength == 0) {
        this.handleHandOut();
      }


      // document.getElementById('showHands').addEventListener('mousedown',
      // function() {
      //   document.getElementById('app').setAttribute('class','show-hands');
      // }, false);
      // document.getElementById('hideHands').addEventListener('mousedown',
      // function() {
      //   document.getElementById('app').setAttribute('class','');
      // }, false);
    });
  }

  handleHandOut() {
    if (this.step == 0 && this.title) {
      this.title.removeCursor();
    }

    var els = document.getElementById('pointer');
    //els.style.display = 'none';
  }

  handleCursor(point) {
    // this.points.push(point);
    // if (this.points.length > 10) {
    //   this.points = this.points.splice(this.points.length - 10);
    // }

    /**
     * 计算手势轨迹
     */



    var els = document.getElementById('pointer');
    els.style.display = '';
    els.style.left = point.left.toFixed(0) + 'px';
    els.style.top = point.top.toFixed(0) + 'px';
    

    var type = 'move';

    if (this.step == 0 && this.title) {
      this.title.handerCursor(type, point);
    }
    if( this.step == 1 && this.floor) {
      this.floor.handerCursor(type,point);
    }

    if(this.step == 2 && this.scene) {
      this.scene.handerCursor(type,point);
    }

    if(this.step == 3 && this.info) {
      this.info.handerCursor(type,point);
    }
  }


  gesture(params) {
    //console.log('title gesture:',params);

    var time = params['time'];
    var now = new Date().getTime();

    var diff = now - time;

    var startTime = 500;
    var exeTime = 1500;

    //console.log('diff:',diff)
    if(diff > startTime && diff < exeTime) {
      //console.log(' start ...')
      var els = document.getElementById('pointer-outer');
      els.classList.add("active");

      var inner = document.getElementById('pointer-inner');
      var width = (diff-90)/50;

      var widthStr = width.toFixed(0) + "px";
      inner.style.width = widthStr;
      inner.style.height = widthStr;

    } else if(diff>=exeTime) {
       console.log('click....')

      
         var els = document.getElementById('pointer-outer');
          els.classList.remove("active");
          var inner = document.getElementById('pointer-inner');

          inner.style.width = "20px"
          inner.style.height = "20px"

          this.handerGestureClick(params);
       
    } else {
      var els = document.getElementById('pointer-outer');
      els.classList.remove("active");
      var inner = document.getElementById('pointer-inner');

      inner.style.width = "20px"
      inner.style.height = "20px"
    }
  }

  handerGestureClick(params) {
    if(this.step == 0) {
      this.title.handerClick(params['url']);
    }
    if(this.step == 1) {
      this.floor.handerClick(params['title']);
    }
    if(this.step == 2) {
      this.scene.handerClick(params['url']);
    }

    if(this.step == 3 ) {
      this.info.handerClick(params['title']);
    }
  }

  titleChange(item) {
    console.log('title change:', item)
    switch (item.url) {
      case 'floor':
        this.step = 1;
        break;
      case 'scene':
        this.step = 2;
        break;
      case 'info':
        this.step = 3;
        break;
      default:
        this.step = 0;
    }
  }

  backToTitle() {
    this.step = 0;
  }

  /**
   * 检测手势
   * 点击事件
   * 左右滑动
   * 向上滑动
   * @param angles 
   */
  dectGesture(angles) {

  }

  handleSwipe (gesture) {
    var swipeDirection;
    //Classify swipe as either horizontal or vertical
    var isHorizontal = Math.abs(gesture.direction[0]) > Math.abs(gesture.direction[1]);
    //Classify as right-left or up-down
    if (isHorizontal) {
      if (gesture.direction[0] > 0) {
        swipeDirection = "right";
      } else {
        swipeDirection = "left";
      }
    } else { //vertical
      if (gesture.direction[1] > 0) {
        swipeDirection = "up";
      } else {
        swipeDirection = "down";
      }
    }
    console.log(swipeDirection);
    // window.swipeDirection = swipeDirection;
    return swipeDirection;
  }

   getAngle(
      p1,
      p2) {  //由当前点到下一个点这两坐标的[屏幕]标点,返回该向量的角度[0,360)

    var x = p2.left - p1.left;

    var y =
        p1.top - p2.top;  //屏幕坐标系转为直角坐标系，x,y为1到2的直角坐标系原点向量

    var angle = 0;

    if (x > 0) {  //一,四象限

      if (y == 0) {
        angle = 0;  //一四象限0
      }

      else if (y > 0) {
        angle = Math.atan(y / x) * 180 / Math.PI;  //一象限

      }

      else if (y < 0) {
        angle = 360 - Math.atan((-y) / x) * 180 / Math.PI;  //四象限
      }

    }

    else if (x < 0) {  //二三象限

      if (y == 0) {
        angle = 180;  //二三象限0
      }
      else if (y > 0) {
        angle = 180 - Math.atan(y / (-x)) * 180 / Math.PI;  //二象限

      }

      else if (y < 0) {
        angle = Math.atan(y / x) * 180 / Math.PI + 180;  //三象限
      }

    }

    else {  // x==0时

      if (y > 0) {
        // 90度
        angle = 90;
      }
      else if (y < 0) {
        // 270度

        angle = 270;
      }
      else {
        //(0,0)

        angle = 0;
      }
    }

    return angle;
  }
}
