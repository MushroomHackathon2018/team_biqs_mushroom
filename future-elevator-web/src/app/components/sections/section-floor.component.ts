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

  constructor() {}

  ngOnInit() {}

  backClick() {
    this.back.emit();
  }

  itemClick(item) {
    this.itemChange.emit(item);
  } 
}
