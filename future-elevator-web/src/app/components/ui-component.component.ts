import { Component, OnInit } from '@angular/core';
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
  constructor() { }

  ngOnInit() {

    console.log(' leap:',Leap);


    function moveFinger(Finger, posX, posY, posZ) {
      Finger.style.webkitTransform = "translate3d("+posX+"px, "+posY+"px, "+posZ+"px)";
    }

    function moveSphere(Sphere, posX, posY, posZ, rotX, rotY, rotZ) {
      Sphere.style.webkitTransform = Sphere.style.mozTransform =
      Sphere.style.transform = "translateX("+posX+"px) translateY("+posY+"px) translateZ("+posZ+"px) rotateX("+rotX+"deg) rotateY(0deg) rotateZ(0deg)";
    }

    var fingers = {};
    var spheres = {};
    Leap.loop((frame)=> {
      var seenFingers = {};
      var handIds = {};
      var handsLength;
      if (frame.hands === undefined ) {
         handsLength = 0
      } else {
         handsLength = frame.hands.length;
      }

      for (var handId = 0, handCount = handsLength; handId != handCount; handId++) {
        var hand = frame.hands[handId];
        var posX = (hand.palmPosition[0]*3);
        var posY = (hand.palmPosition[2]*3)-200;
        var posZ = (hand.palmPosition[1]*3)-400;
        var rotX = (hand._rotation[2]*90);
        var rotY = (hand._rotation[1]*90);
        var rotZ = (hand._rotation[0]*90);
        var sphere = spheres[hand.id];
        var sphereDiv;
        if (!sphere) {
           sphereDiv = document.getElementById("sphere").cloneNode(true);
          sphereDiv.setAttribute('id',hand.id);
          sphereDiv.style.backgroundColor='#'+Math.floor(Math.random()*16777215).toString(16);
          document.getElementById('scene').appendChild(sphereDiv);
          spheres[hand.id] = hand.id;
        } else {
           sphereDiv =  document.getElementById(hand.id);
          if (typeof(sphereDiv) != 'undefined' && sphereDiv != null) {
            moveSphere(sphereDiv, posX, posY, posZ, rotX, rotY, rotZ);
          }
        }
        handIds[hand.id] = true;
      }
      for (var handIdInner in spheres) {
        if (!handIds[handIdInner]) {
          sphereDiv =  document.getElementById(spheres[handId]);
          if(sphereDiv && sphereDiv.parentNode) {
           sphereDiv.parentNode.removeChild(sphereDiv);

          }
          delete spheres[handId];
        }
      }

      for (var pointableId = 0, pointableCount = frame.pointables.length; pointableId != pointableCount; pointableId++) {
        var pointable = frame.pointables[pointableId];
        var newFinger = false;
        if (pointable.finger) {
          if (!fingers[pointable.id]) {
            fingers[pointable.id] = [];
            newFinger = true;
          }

          for (var partId = 0, length; partId != 4; partId++) {
            var posX = (pointable.positions[partId][0]*3);
            var posY = (pointable.positions[partId][2]*3)-200;
            var posZ = (pointable.positions[partId][1]*3)-400;

            var id = pointable.id+'_'+partId;
           // console.log('id:',id);

            var finger = fingers[id];
            var fingerDiv;
            if (newFinger) {

            
              fingerDiv = document.getElementById("finger").cloneNode(true);
              fingerDiv.setAttribute('id', id);
              fingerDiv.style.backgroundColor='#'+Math.floor(pointable.type*500).toString(16);
              
              if(pointable.type == 1 && partId == 3) {
                //console.log('食指')

                fingerDiv.style.backgroundColor = '#000';
            }
              
              document.getElementById('scene').appendChild(fingerDiv);
              fingers[pointable.id].push(id);
            } else  {
               fingerDiv =  document.getElementById(id);
              if (typeof(fingerDiv) != 'undefined' && fingerDiv != null) {
                moveFinger(fingerDiv, posX, posY, posZ);

                if(pointable.type == 1 && partId == 3) {
                  
  
                  var offsets = fingerDiv.getBoundingClientRect();
                  var top = offsets.top;
                  var left = offsets.left;
                  var els = document.getElementById("pointer");
                  els.style.left = left.toFixed(0) + "px";
                  els.style.top = top.toFixed(0) + "px";;
                  //console.log('食指：',left,top);
                  //console.log('els',els);
              }
                
              }
            }
            seenFingers[pointable.id] = true;
          }

          //var dirX = -(pointable.direction[1]*90);
          //var dirY = -(pointable.direction[2]*90);
          //var dirZ = (pointable.direction[0]*90);
        }
      }
      for (var fingerId in fingers) {
        if (!seenFingers[fingerId]) {
          var ids = fingers[fingerId];
          for (var index in ids) {
            fingerDiv =  document.getElementById(ids[index]);
            fingerDiv.parentNode.removeChild(fingerDiv);
          }
          delete fingers[fingerId];
        }
      }



    
      // document.getElementById('showHands').addEventListener('mousedown', function() {
      //   document.getElementById('app').setAttribute('class','show-hands');
      // }, false);
      // document.getElementById('hideHands').addEventListener('mousedown', function() {
      //   document.getElementById('app').setAttribute('class','');
      // }, false);
    });
  }



  titleChange(item) {
    console.log('title change:',item)
      switch(item.url) {
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

}
