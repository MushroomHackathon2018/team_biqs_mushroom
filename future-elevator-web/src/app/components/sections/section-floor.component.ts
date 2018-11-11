import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'section-floor',
  templateUrl: './section-floor.component.html',
  styleUrls: ['./section-floor.component.less']
})
export class SectionFloorComponent implements OnInit {
  @Output() back: EventEmitter<any> = new EventEmitter();

  @Output()
  itemChange: EventEmitter<any> = new EventEmitter();
  items = [
    {title: '10'},
    {title: '20'},
    {title: '30'},
    {title: '40'},
    {title: '50'},
    {title: '60'},
    {title: '70'},
    {title: '80'},
    {title: '90'}
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
              var title =item.getAttribute("title");
              this.gestureItem = item;
              if(this.gestureTime == 0) {
                this.gestureTime = new Date().getTime();

              }
              var time = this.gestureTime;

              this.gestureChange.emit({
                title,
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
              var title ='back';
              this.gestureItem = item;
              if(this.gestureTime == 0) {
                this.gestureTime = new Date().getTime();

              }
              var time = this.gestureTime;

              this.gestureChange.emit({
                title,
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
