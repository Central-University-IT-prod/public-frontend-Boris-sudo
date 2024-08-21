import {Injectable} from '@angular/core';
import {Background} from "../modules/background.model";

@Injectable({
  providedIn: 'root'
})
export class BackgroundService {
  private backgrounds: Background[] = [
    {cost: 0, color: '#d3ff00', edit_color: '#000000'},
    {cost: 0, color: '#3fff00', edit_color: '#000000'},
    {cost: 100, color: '#00ffd0', edit_color: '#000000'},
    {cost: 100, color: '#ffa600', edit_color: '#000000'},
    {cost: 100, color: '#e600ff', edit_color: '#000000'},
    {cost: 500, color: '#00b2ff', edit_color: '#000000'},
    {cost: 500, color: '#ff0000', edit_color: '#000000'},
    {cost: 500, color: '#0800ff', edit_color: '#000000'},
    {cost: 1000, color: '#0009b2', edit_color: '#ffffff'},
    {cost: 1000, color: '#ff6200', edit_color: '#000000'},
    {cost: 1000, color: '#790bc0', edit_color: '#fff'},
    {cost: 5000, color: '#3ea91a', edit_color: '#000000'},
    {cost: 5000, color: '#d70637', edit_color: '#000000'},
    {cost: 5000, color: '#4b4b4b', edit_color: '#fff'},
    {cost: 10000, color: '#031259', edit_color: '#fff'},
    {cost: 10000, color: '#131f24', edit_color: '#fff'},
  ];

  constructor() {
  }

  get_by_id(id: number): Background {
    return this.backgrounds[id];
  }

  get() {
    return this.backgrounds;
  }

  get_id(item: Background) {
    for (let i = 0; i < this.backgrounds.length; i++)
      if (this.backgrounds[i] == item)
        return i;
    return 0;
  }
}
