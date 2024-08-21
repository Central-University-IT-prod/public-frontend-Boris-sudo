import {Injectable} from '@angular/core';
import {LocalstorageMethodsService} from "./localstorage-methods.service";
import {HabitModel} from "../modules/habit.model";
import {CurrentDateService} from "./current-date.service";

@Injectable({
  providedIn: 'root'
})
export class DoneValueService {
  private key: string = 'tasks-done-value';


  constructor(
    private localstorage: LocalstorageMethodsService,
    private date_service: CurrentDateService,
  ) {
  }

  getALlDontSet() {
    if (this.localstorage.get(this.key) == '') this.localstorage.set(this.key, '{}');
    return JSON.parse(this.localstorage.get(this.key));
  }

  getAll(date: string, id: number) {
    if (this.localstorage.get(this.key) == '') this.localstorage.set(this.key, '{}');
    let values = JSON.parse(this.localstorage.get(this.key));
    if (values[date] == undefined) values[date] = {};
    if (values[date][id] == undefined) values[date][id] = 0;
    return values;
  }

  get(date: string, id: number) {
    let values = this.getAll(date,id);
    this.setAll(values);
    return values[date][id];
  }

  setById(date: string, id: number, value: number) {
    let values = this.getAll(date,id);
    values[date][id] = value;
    this.setAll(values);
  }

  setByHabit(date: string, habit: HabitModel) {
    let start_date = new Date();
    let finish_date = new Date();
    if (habit.period == 'daily') {
      start_date = new Date(date);
      finish_date = new Date(date);
    } else if (habit.period == 'weekly') {
      start_date = new Date(this.date_service.get_week_start(date));
      finish_date = new Date(this.date_service.get_week_end(date));
    } else if (habit.period == 'monthly') {
      start_date = new Date(this.date_service.get_month_start(date));
      finish_date = new Date(this.date_service.get_month_end(date));
    }

    while (start_date <= finish_date) {
      date = start_date.toJSON().split('T')[0];
      this.setById(date, habit.id, habit.doneValue!);
      start_date.setDate(start_date.getDate() + 1);
    }
  }

  setAll(value: any) {
    let string = this.toJsonJsonToString(value);
    this.localstorage.set(this.key, string);
  }

  toJsonJsonToString(a: any) {
    let result = '{';
    for (const key in a) {
      result += '"' + key + '": ' + this.localstorage.convertJsonToString(a[key]);
      result += ', ';
    }
    result = result.substring(0, result.length - 2);
    result += '}';
    return result;
  }
}
