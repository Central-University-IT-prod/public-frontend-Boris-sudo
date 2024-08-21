import {Injectable} from '@angular/core';
import {LocalstorageMethodsService} from "./localstorage-methods.service";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class CurrentDateService {
  observer = new Subject();
  public subscriber$ = this.observer.asObservable();

  public months = ['', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  private date: string = (new Date()).toJSON().split('T')[0];

  constructor(
    private localstorage_service: LocalstorageMethodsService,
  ) {
  }

  emit_date() {
    this.observer.next(this.date);
  }

  set_date(new_date: string) {
    this.date = new_date;
    this.localstorage_service.set('date', this.date);
    this.emit_date();
  }

  get_date() {
    if (this.localstorage_service.get('date') == '')
      this.set_date(this.date);
    else
      this.date = this.localstorage_service.get('date');
    return this.date;
  }

  is_end_of_week() {
    let date = new Date(this.get_date());
    return date.getDay() == 0;
  }

  is_end_of_month() {
    let date = new Date(this.get_date());
    let month = date.getMonth();
    date.setDate(date.getDate() + 1);
    return date.getMonth() != month;
  }

  next_day() {
    let currentDate = new Date(this.date);
    currentDate.setDate(currentDate.getDate() + 1);
    this.set_date(currentDate.toJSON().split('T')[0]);
  }

  prev_day() {
    let currentDate = new Date(this.date);
    currentDate.setDate(currentDate.getDate() - 1);
    this.set_date(currentDate.toJSON().split('T')[0]);
  }

  get_week_start(date_string: string) {
    let date = new Date(date_string);
    let diff = date.getDate() - date.getDay() + (date.getDay() === 0? -6 : 1);
    date.setDate(diff);
    return date.toJSON().split('T')[0];
  }

  get_week_end(date_string: string) {
    let date = new Date(this.get_week_start(date_string));
    date.setDate(date.getDate() + 6);
    return date.toJSON().split('T')[0];
  }

  get_month_start(date_string: string) {
    let date = new Date(date_string);
    date = new Date(date.getFullYear(), date.getMonth(), 1);
    return date.toJSON().split('T')[0];
  }

  get_month_end(date_string: string) {
    let date = new Date(date_string);
    date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return date.toJSON().split('T')[0];
  }
}
