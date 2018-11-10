import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'section-info',
  templateUrl: './section-info.component.html',
  styleUrls: ['./section-info.component.less']
})
export class SectionInfoComponent implements OnInit {

  @Output() back: EventEmitter<any> = new EventEmitter();
  constructor() { }


  items = [{
    title : '特朗普：美国从即日起拒绝非法入境者避难请求',
    image: 'http://inews.gtimg.com/newsapp_ls/0/6258453826_150120/0',
  },{
    title : '福建警方对碳九泄漏事件4名涉事人员调查取证',
    image: 'http://img1.gtimg.com/ninja/2/2018/11/ninja154180761293857.jpg',
  },{
    title : '赖小民案牵涉关系以百计 现有力量没有3年难办完',
    image: 'http://img1.gtimg.com/ninja/2/2018/11/ninja154180928418490.jpg',
  },{
    title : '首套房贷利率连涨22个月 明年或有10％下调空间',
    image: 'http://img1.gtimg.com/ninja/2/2018/11/ninja154180897671255.jpg',
  }]

  ngOnInit() {
  }


  backClick() {
    this.back.emit();
  }
}
