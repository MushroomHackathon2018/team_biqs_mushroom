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
  ]

  @Output()
  itemChange: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  itemClick(item) {
    this.itemChange.emit(item);
    console.log('item click:',item);
  }
  /**
   * 手势控制
   * @param type 
   * @param point 
   */
  handerCursor(type,point) {

  }

}
