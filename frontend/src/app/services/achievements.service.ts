import {Injectable} from '@angular/core';
import {LocalstorageMethodsService} from "./localstorage-methods.service";
import {Subject} from "rxjs";

export interface Achievement {
  title: string;
  level: number;
  have_progress: number;
  need_progress: number[];
  about_text?: string;
  about: string;
  to_about: string[];
  img_path: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class AchievementsService {
  observer = new Subject();
  public subscribers$ = this.observer.asObservable();

  private achievements: Achievement[] = [];
  private colors: string[] = [
    '#f4f000', '#97ea07', '#0ae750',
    '#00d8f4', '#ea07bd', '#e70a0a',
    '#f48200', '#fff200',
  ];
  private key: string = 'achievements';

  constructor(
    private localstorage: LocalstorageMethodsService,
  ) {
  }

  emit_data(data: Achievement) {
    this.observer.next(data);
  }

  defaultAchievements(): Achievement[] {
    return [
      {
        title: 'Работяга',
        level: 0,
        have_progress: 0,
        need_progress: [5, 10, 15, 30, 50, 100],
        about: 'Оставайтесь в ударном режиме $.',
        to_about: ['5 дней', '10 дней', '15 дней', '30 дней', '50 дней', '100 дней'],
        img_path: 'fire.svg',
        color: '',
      },
      {
        title: 'Продвинутый',
        level: 0,
        have_progress: 0,
        need_progress: [100, 500, 1000, 1500, 2500, 5000, 7500, 10000],
        about: 'Получите $ очков опыта.',
        to_about: ['100', '500', '1000', '1500', '2500', '5000', '7500', '10000'],
        img_path: 'cup.svg',
        color: '',
      },
      {
        title: 'Закалённый',
        level: 0,
        have_progress: 0,
        need_progress: [5, 10, 15, 30, 50, 100],
        about: 'Выполните полностью $ привычек.',
        to_about: ['5', '10', '15', '30', '50', '100'],
        img_path: 'hand.svg',
        color: '',
      },
      {
        title: 'Богач',
        level: 0,
        have_progress: 0,
        need_progress: [100, 500, 1000, 2500, 5000, 10000],
        about: 'На вашем счету $ монет.',
        to_about: ['100', '500', '1000', '2500', '5000', '10000'],
        img_path: 'coin.svg',
        color: '',
      },
    ];
  }

  to_localstorage() {
    this.localstorage.set(this.key, JSON.stringify(this.achievements));
  }

  from_localstorage() {
    let result = this.localstorage.get(this.key);
    if (result == '') this.achievements = this.defaultAchievements();
    else this.achievements = JSON.parse(result);
    this.to_localstorage();
  }

  get_achievements(): Achievement[] {
    this.from_localstorage();
    for (const achievement of this.achievements) {
      achievement.about_text = achievement.about.replace('$', achievement.to_about[achievement.level]);
      achievement.color = this.get_color(achievement.level);
    }
    return this.achievements;
  }

  get_color(level: number): string {
    return this.colors[level];
  }

  add_progress(id: number, xp: number) {
    this.from_localstorage();
    this.achievements[id].have_progress += xp;
    const level = this.achievements[id].level;
    while (this.achievements[id].have_progress >= this.achievements[id].need_progress[this.achievements[id].level]) {
      if (this.achievements[id].need_progress.length - 1 > this.achievements[id].level)
        this.achievements[id].level++;
      else
        break;
    }
    if (level != this.achievements[id].level) {
      this.emit_data(this.achievements[id]);
    }
    this.to_localstorage();
  }

  set_progress(id: number, xp: number) {
    this.from_localstorage();
    const progress = this.achievements[id].have_progress;
    if (progress < xp) this.add_progress(id, xp - progress);
    this.to_localstorage();
  }

  set_progress_ignore_max(id: number, xp: number) {
    this.from_localstorage();
    this.add_progress(id, xp-this.achievements[id].have_progress);
    this.to_localstorage();
  }
}
