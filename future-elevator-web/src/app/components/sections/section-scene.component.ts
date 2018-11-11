import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'section-scene',
  templateUrl: './section-scene.component.html',
  styleUrls: ['./section-scene.component.less']
})
export class SectionSceneComponent implements OnInit {


  @Output() back: EventEmitter<any> = new EventEmitter();

  @Output()
  itemChange: EventEmitter<any> = new EventEmitter();
  items = [
    {title: '太空',
      image: 'assets/images/space.jpg',
      url: 'space'
    },
    {title: '蹦极',
    image: 'assets/images/bengji.jpg',
    url: 'bengji'
  }
  ]


  gestureItem = null;
  gestureTime = 0;

  @Output()
  gestureChange: EventEmitter<any> = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  backClick() {
    this.back.emit();
  }

  itemClick(item) {
    this.itemChange.emit(item);
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
        var items = document.querySelectorAll(".container  .item")

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

              this.gestureChange.emit({
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

        var back = document.querySelectorAll(".back");
        back.forEach(item =>{
          var rect = item.getBoundingClientRect();

          if(rect.left < point.left && rect.right > point.left && rect.top < point.top && rect.bottom > point.top) {
              item.classList.add("active")
              var url ='back';
              this.gestureItem = item;
              if(this.gestureTime == 0) {
                this.gestureTime = new Date().getTime();

              }
              var time = this.gestureTime;

              this.gestureChange.emit({
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

  handerClick(title) {
    if(title == 'back') {
      this.backClick();
    } else {
      this.items.forEach(item => {
        if(item.title == title) {
          this.itemClick(item);
        }
    })
    }
    
  }

  removeCursor() {
    var items = document.querySelectorAll(".container > .item")
    this.gestureItem = null;
    this.gestureTime = 0;
    items.forEach(item => {
      item.classList.remove("active")
    })


    var back = document.querySelectorAll(".back");
    back.forEach(item =>{

      item.classList.remove("active")
    
    })
  }
}
