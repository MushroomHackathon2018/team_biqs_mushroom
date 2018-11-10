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
      image: 'assets/images/space.jpg'
    },
    {title: '蹦极',
    image: 'assets/images/bengji.jpg'}
  ]

  constructor() {}

  ngOnInit() {}

  backClick() {
    this.back.emit();
  }

  itemClick(item) {
    this.itemChange.emit(item);
  } 
}
