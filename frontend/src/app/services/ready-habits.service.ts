import {Injectable} from '@angular/core';
import {HabitModel, HabitsCollectionModel} from "../modules/habit.model";

@Injectable({
  providedIn: 'root'
})
export class ReadyHabitsService {
  public habit_collections: HabitsCollectionModel[] = [
    {title: 'Здоровье', habits: [
        { id: 0, title: 'Бегать 5 км', targetValue: 5, period: 'daily', type: 'numeric', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Спать 8 часов', targetValue: 8, period: 'daily', type: 'numeric', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Делать зарядку', targetValue: 0, period: 'daily', type: 'boolean', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Пить воду', targetValue: 2000, period: 'daily', type: 'numeric', addDate: new Date(), deletedDate: new Date(), }
      ]},
    {title: 'Учеба', habits: [
        { id: 0, title: 'Конспектируйте', targetValue: 0, period: 'daily', type: 'boolean', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Сделайте перерыв', targetValue: 5, period: 'daily', type: 'numeric', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Учиться 5 часов', targetValue: 5, period: 'daily', type: 'numeric', addDate: new Date(), deletedDate: new Date(), },
        { id: 0, title: 'Сделать дз', targetValue: 0, period: 'daily', type: 'boolean', addDate: new Date(), deletedDate: new Date(), }
      ]},
  ];

  constructor() {
  }

  get_all(): HabitsCollectionModel[] {
    return this.habit_collections;
  }

  get_collection(collection_title: string): HabitsCollectionModel {
    for (const habit_collection of this.habit_collections)
      if (habit_collection.title == collection_title)
        return habit_collection;
    return {title: '', habits: []};
  }

  get_habit(habit_title: string): HabitModel {
    for (const habit_collection of this.habit_collections)
      for (const habit of habit_collection.habits)
        if (habit.title == habit_title)
          return habit;
    return {title: '', period: "daily", type: "boolean", addDate: new Date(), deletedDate: new Date(), id: 0};
  }
}
