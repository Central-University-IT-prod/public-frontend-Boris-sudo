import {Injectable} from '@angular/core';
import {LocalstorageMethodsService} from "./localstorage-methods.service";
import {CurrentDateService} from "./current-date.service";
import {HabitModel} from "../modules/habit.model";
import {DoneValueService} from "./done-value.service";
import {AchievementsService} from "./achievements.service";
import {Subject} from "rxjs";
import {Profile} from "../modules/profile.model";


@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  observer = new Subject()
  public subscribers$ = this.observer.asObservable();

  private profile: Profile = {};
  private key: string = 'profile-info';

  public notification_time = 50000;

  constructor(
    private localstorage: LocalstorageMethodsService,
    private date_service: CurrentDateService,
    private done_value_service: DoneValueService,
    private achievement_service: AchievementsService,
  ) {
  }

  emit_data() {
    this.observer.next({});
  }

  defaultProfile(): Profile {
    return {
      avatar_id: 0,
      available_avatars: [0, 1, 2, 3],

      background_id: 0,
      available_backgrounds: [0, 1],

      level: 0,
      money: 0,
      streak_days: 0,
      habits_complete: 0,

      freeze_count: 0,
    }
  }

  to_localstorage() {
    this.localstorage.set(this.key, JSON.stringify(this.profile));
    this.emit_data();
  }

  from_localstorage() {
    let result = this.localstorage.get(this.key);
    if (result == '') {
      this.profile = this.defaultProfile();
      this.to_localstorage();
    } else this.profile = JSON.parse(result);
  }

  get(): Profile {
    this.from_localstorage();
    return this.profile;
  }

  set(profile: Profile) {
    this.profile = profile;
    this.to_localstorage();
  }

  add_daily_streak() {
    this.from_localstorage();
    this.profile.streak_days!++;
    this.to_localstorage();
    this.achievement_service.set_progress(0, this.profile.streak_days!);
  }

  reset_daily_streak() {
    this.from_localstorage();
    this.profile.streak_days = 0;
    this.to_localstorage();
    this.achievement_service.set_progress(0, this.profile.streak_days);
  }

  get_tasks(): HabitModel[] {
    const date: string = this.date_service.get_date();
    const string_value: string = this.localstorage.get('habits');
    let all_habits: HabitModel[] = this.localstorage.toJson("[" + string_value + "]");
    let habits: HabitModel[] = [];

    for (const habit of all_habits) {
      habit.addDate = new Date(habit.addDate);
      if (habit.addDate.toJSON().split('T')[0] <= date)
        habits.push(habit);
    }
    for (let i = 0; i < habits.length; i++) {
      habits[i].doneValue = this.done_value_service.get(date, habits[i].id);
      habits[i].targetValue = Number(habits[i].targetValue);
    }

    return habits;
  }

  count_done(): number {
    const habits: HabitModel[] = this.get_tasks();
    let result = 0;

    for (const habit of habits) {
      if (habit.doneValue == habit.targetValue) {
        if (habit.period == 'daily') result++;
        else if (habit.period == 'weekly' && this.date_service.is_end_of_week()) result++;
        else if (habit.period == 'monthly' && this.date_service.is_end_of_month()) result++;
      }
    }

    return result;
  }

  get_all_habits(): HabitModel[] {
    const habits: HabitModel[] = this.get_tasks();
    let result: HabitModel[] = [];

    for (const habit of habits) {
      if (habit.period == 'daily') result.push(habit);
      else if (habit.period == 'weekly' && this.date_service.is_end_of_week()) result.push(habit);
      else if (habit.period == 'monthly' && this.date_service.is_end_of_month()) result.push(habit);
    }

    return result;
  }

  are_all_done(): boolean {
    const all_count = this.get_all_habits().length;
    const solved_count: number = this.count_done();

    return all_count <= solved_count;
  }

  add_completed_habits_count(count: number) {
    this.from_localstorage();
    this.profile.habits_complete! += count;
    this.achievement_service.set_progress_ignore_max(2, this.profile.habits_complete!);
    this.to_localstorage();
  }

  add_level_point(sign: number) {
    const level_points = sign * 100;

    this.from_localstorage();
    this.profile.level! += level_points;
    this.achievement_service.set_progress_ignore_max(1, this.profile.level!);
    this.to_localstorage();
  }

  add_levels(count: number) {
    this.from_localstorage();
    this.profile.level! += count;
    this.achievement_service.set_progress_ignore_max(1, this.profile.level!);
    this.to_localstorage();
  }

  add_money(sign: number) {
    const money = sign * 100;

    this.from_localstorage();
    this.profile.money! += money;
    this.achievement_service.set_progress_ignore_max(3, this.profile.money!);
    this.to_localstorage();
  }

  add_money_with_count(count: number) {
    this.from_localstorage();
    this.profile.money! += count;
    this.achievement_service.set_progress_ignore_max(3, this.profile.money!);
    this.to_localstorage();
  }

  add_freeze_count(cost: number) {
    this.from_localstorage();
    this.profile.freeze_count!++;
    this.profile.money! -= cost;
    this.to_localstorage();
    this.add_money(0);
  }

  add_avatar(id: number, cost: number) {
    this.from_localstorage();
    this.profile.available_avatars!.push(id);
    this.profile.money! -= cost;
    this.to_localstorage();
    this.add_money(0);
  }

  add_background(id: number, cost: number) {
    this.from_localstorage();
    this.profile.available_backgrounds!.push(id);
    this.profile.money! -= cost;
    this.to_localstorage();
    this.add_money(0);
  }

  use_freeze() {
    this.from_localstorage();
    this.profile.freeze_count!--;
    this.to_localstorage();
  }

  async notification() {
    if (this.are_all_done()) return;
    alert('может уже начнете что то делать?');
  }
}
