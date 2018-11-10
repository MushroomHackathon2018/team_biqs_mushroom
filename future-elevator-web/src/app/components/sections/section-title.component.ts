import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'section-title',
  templateUrl: './section-title.component.html',
  styleUrls: ['./section-title.component.less']
})
export class SectionTitleComponent implements OnInit {

  items = [
    {
      title: '楼层',
      url: 'floor'
    },{
      title: '场景',
      url: 'scene'
    }, {
      title: '信息',
      url: 'info'
    }
  ];

  gestureItem = null;
  gestureTime = 0;



  @Output()
  itemChange: EventEmitter<any> = new EventEmitter();

  @Output()
  titleGestureChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  itemClick(item) {
    this.itemChange.emit(item);
    console.log('item click:',item);
  }
  /**
   * 手势控制
   * @param type  类型  move ,  click  , swipe_left , swipe_right
   * @param point 
   *    left,top
   */
  handerCursor(type,point) {
    switch(type) {
      case 'move':
        var items = document.querySelectorAll(".container > .item")

        items.forEach(item => {
          var rect = item.getBoundingClientRect();

          if(rect.left < point.left && rect.right > point.left && rect.top < point.top && rect.bottom > point.top) {
              item.classList.add("active")
              var url =item.getAttribute("url");
              this.gestureItem = item;
              if(this.gestureTime == 0) {
                this.gestureTime = new Date().getTime();

              }
              var time = this.gestureTime;

              this.titleGestureChange.emit({
                url,
                time
              })
          } else {
              item.classList.remove("active")
              if(this.gestureItem && this.gestureItem == item) {
                this.gestureTime = 0;

              }
          }
        })

      break;
    }
  }

  handerClick(url) {
    this.items.forEach(item => {
        if(item.url == url) {
          this.itemClick(item);
        }
    })
  }

  removeCursor() {
    var items = document.querySelectorAll(".container > .item")
    this.gestureItem = null;
    this.gestureTime = 0;
    items.forEach(item => {
      item.classList.remove("active")
    })
  }

}
