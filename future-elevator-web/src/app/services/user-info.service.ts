import { Injectable } from '@angular/core';
/**
 * 全局信息
 */
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  name:string;
  personId:string;
  avatar:string;

  constructor() { }

  update(info) {
    this.name = info['name'];
    this.personId = info['personId'];
    this.avatar = this.personId;
  }

  get() {
    return {
      name:this.name,
      personId: this.personId,
      avatar: this.avatar
    }
  }
}
