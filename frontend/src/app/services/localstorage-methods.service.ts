import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageMethodsService {

  constructor() {
  }

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string) {
    let result = localStorage.getItem(key);
    if (result == null) result = '';
    return result;
  }

  push(key: string, item: string) {
    let string_value = this.get(key);
    if (string_value != '') string_value += ', ';
    string_value += item;
    this.set(key, string_value);
  }

  delete(key: string, item: string) {
    let string_value = this.get(key);
    let new_string_value = string_value;
    if (string_value.indexOf(', '+item) != -1)
      new_string_value = string_value.replace(', '+item, '');
    else if (string_value.indexOf(item + ', ') != -1)
      new_string_value = string_value.replace(item+', ', '');
    else if (string_value.indexOf(item) != -1)
      new_string_value = string_value.replace(item, '');
    this.set(key,new_string_value);
  }

  convertJsonToString(habit: any) {
    let result = '{';
    for (const key in habit) {
      let value = habit[key];
      // @ts-ignore
      result += `"${key}": "${value}", `
    }
    result = result.substring(0, result.length - 2);
    result += '}';
    return result;
  }

  convertJsonArrayToString(array: any[]) {
    let result = '';
    for (let i = 0; i < array.length; i++) {
      if (i!=0) result += ', ';
      result += this.convertJsonToString(array[i]);
    }
    result+='';
    return result;
  }

  toJson(string_value: string): any {
    return JSON.parse(string_value);
  }
}
