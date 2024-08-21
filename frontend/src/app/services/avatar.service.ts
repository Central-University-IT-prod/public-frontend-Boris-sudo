import {Injectable} from '@angular/core';
import {Avatar} from "../modules/avatar.model";

@Injectable({
  providedIn: 'root'
})
export class AvatarService {
  private avatars: Avatar[] = [
    {cost: 0, path: '/assets/avatars/0_1.png'},
    {cost: 0, path: '/assets/avatars/0_2.png'},
    {cost: 0, path: '/assets/avatars/0_3.png'},
    {cost: 0, path: '/assets/avatars/0_4.png'},
    {cost: 300, path: '/assets/avatars/300_1.png'},
    {cost: 300, path: '/assets/avatars/300_2.png'},
    {cost: 300, path: '/assets/avatars/300_3.png'},
    {cost: 300, path: '/assets/avatars/300_4.png'},
    {cost: 300, path: '/assets/avatars/300_5.png'},
    {cost: 500, path: '/assets/avatars/500_1.png'},
    {cost: 500, path: '/assets/avatars/500_2.png'},
    {cost: 500, path: '/assets/avatars/500_3.png'},
    {cost: 500, path: '/assets/avatars/500_4.png'},
    {cost: 500, path: '/assets/avatars/500_5.png'},
    {cost: 1000, path: '/assets/avatars/1000_1.png'},
    {cost: 1000, path: '/assets/avatars/1000_2.png'},
    {cost: 1000, path: '/assets/avatars/1000_3.png'},
    {cost: 1000, path: '/assets/avatars/1000_4.png'},
    {cost: 1000, path: '/assets/avatars/1000_5.png'},
    {cost: 2500, path: '/assets/avatars/2500_1.png'},
    {cost: 2500, path: '/assets/avatars/2500_2.png'},
    {cost: 2500, path: '/assets/avatars/2500_3.png'},
    {cost: 5000, path: '/assets/avatars/5000_1.png'},
    {cost: 5000, path: '/assets/avatars/5000_2.png'},
    {cost: 5000, path: '/assets/avatars/5000_3.png'},
    {cost: 5000, path: '/assets/avatars/5000_4.png'},
    {cost: 10000, path: '/assets/avatars/10000_1.png'},
    {cost: 10000, path: '/assets/avatars/10000_2.png'},
    {cost: 10000, path: '/assets/avatars/10000_3.png'},
    {cost: 10000, path: '/assets/avatars/10000_4.png'},
    {cost: 10000, path: '/assets/avatars/10000_5.png'},
  ];

  constructor() {
  }

  get_by_id(id: number): Avatar {
    return this.avatars[id];
  }

  get() {
    return this.avatars;
  }

  get_id(item: Avatar) {
    for (let i = 0; i < this.avatars.length; i++)
      if (this.avatars[i] == item)
        return i;
    return 0;
  }
}
