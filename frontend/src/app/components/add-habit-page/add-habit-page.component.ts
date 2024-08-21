import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Location} from "@angular/common";
import {HabitModel, HabitsCollectionModel} from "../../modules/habit.model";
import {LocalstorageMethodsService} from "../../services/localstorage-methods.service";
import {CurrentDateService} from "../../services/current-date.service";
import {DoneValueService} from "../../services/done-value.service";
import {ReadyHabitsService} from "../../services/ready-habits.service";
import {ProfileService} from "../../services/profile.service";
import {LoaderComponent} from "../loader/loader.component";

interface DateCard {
  date: Date;
}

@Component({
  selector: 'app-add-habit-page',
  templateUrl: './add-habit-page.component.html',
  styleUrls: ['./add-habit-page.component.css']
})
export class AddHabitPageComponent implements OnInit, AfterViewInit {
  public new_habit: HabitModel = {
    id: 0,
    title: '',
    period: 'daily',
    addDate: new Date(),
    deletedDate: new Date(),
    type: 'boolean',
    targetValue: 0,
  }
  public frequency_date_type_chose: 'daily' | 'weekly' | 'monthly' = 'daily';
  public goal_type_chose: 'boolean' | 'numeric' = 'boolean';
  public target_value: string = '';
  public submenus: string[] = ['habit-frequency-dropdown-menu', 'habit-goal-dropdown-menu']

  public all_habits: HabitModel[] = [];
  public deleted_habits: HabitModel[] = [];

  public user: string = '';

  public opened_habit_id = -1;
  public deleting_habit: any = {};

  public near_dates: DateCard[] = [];
  public week_days: string[] = ['mon', 'tue', 'wed', 'thu', 'fri', 'sun', 'sat'];
  public watching_date: string = '';

  public ready_habits: HabitsCollectionModel[] = [];
  public selected_collection: HabitModel[] = [];

  constructor(
    private profile_service: ProfileService,
    private ready_habits_service: ReadyHabitsService,
    private done_value_service: DoneValueService,
    public date_service: CurrentDateService,
    public current_date_service: CurrentDateService,
    private localstorage_service: LocalstorageMethodsService,
    private location: Location,
  ) {
  }

  ngOnInit(): void {
    // loader
    LoaderComponent.show_loader();
    // other
    this.watching_date = this.date_service.get_date();
    document.onkeyup = (e) => {
      if (e.key == 'Escape') this.closeMenu('add-habit-menu');
    };
    this.user = this.localstorage_service.get('user');
    this.get_all_habits();
    this.get_deleted_habits();
    this.setNewHabitToDefault();

    // setting dates
    const delta = 15;
    for (let i = -delta; i < delta; i++) {
      let date = new Date();
      date.setDate(date.getDate() + i);
      this.near_dates.push({date: date,})
    }
    // setting ready habits
    this.ready_habits = this.ready_habits_service.get_all();
    // subscribing to date-service
    this.date_service.subscriber$.subscribe(() => {
      this.watching_date = this.date_service.get_date();
      this.scrollToSelectedDate();
      this.get_all_habits();
      this.get_deleted_habits();
      setTimeout(() => {
        this.update_percent();
      });
    })
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.update_percent();
    });
    this.scrollToSelectedDate();
    document.fonts.ready.then(() => {
      LoaderComponent.hide_loader();
    });
  }

  get_deleted_habits() {
    const string_value = this.localstorage_service.get('deleted-habits');
    const habits: HabitModel[] = this.localstorage_service.toJson("[" + string_value + "]");
    this.deleted_habits = [];
    for (const habit of habits) {
      habit.addDate = new Date(habit.addDate);
      habit.deletedDate = new Date(habit.deletedDate);
      if (habit.deletedDate.toJSON().split('T')[0] > this.watching_date && habit.addDate.toJSON().split('T')[0] <= this.watching_date)
        this.deleted_habits.push(habit);
    }

    for (let i = 0; i < this.deleted_habits.length; i++) {
      this.deleted_habits[i].doneValue = this.done_value_service.get(this.watching_date, this.deleted_habits[i].id);
      this.deleted_habits[i].targetValue = Number(this.deleted_habits[i].targetValue);
    }

    setTimeout(()=>{
      this.update_percent();
    });
  }

  get_all_habits() {
    const string_value = this.localstorage_service.get('habits');
    const habits: HabitModel[] = this.localstorage_service.toJson("[" + string_value + "]");
    this.all_habits = [];
    for (const habit of habits) {
      habit.addDate = new Date(habit.addDate);
      habit.deletedDate = new Date(habit.deletedDate);
      if (habit.addDate.toJSON().split('T')[0] <= this.watching_date)
        this.all_habits.push(habit);
    }

    for (let i = 0; i < this.all_habits.length; i++) {
      this.all_habits[i].doneValue = this.done_value_service.get(this.watching_date, this.all_habits[i].id);
      this.all_habits[i].targetValue = Number(this.all_habits[i].targetValue);
    }

    setTimeout(()=>{
      this.update_percent();
    });
  }

  navigateBack() {
    this.location.back();
  }

  openMenu(id: string) {
    for (const submenu of this.submenus) if (submenu != id) this.closeMenu(submenu);

    const menu = document.getElementById(id)!;
    menu.style.display = 'flex';
    setTimeout(() => {
      menu.classList.add('show');
    })
  }

  closeMenu(id: string) {
    if (this.submenus.indexOf(id) == -1) for (const submenu of this.submenus) this.closeMenu(submenu);

    const menu = document.getElementById(id)!;
    menu.classList.remove('show');
    setTimeout(() => {
      menu.style.display = 'none';
    }, 300);
  }

  changeNewHabitValue(key: string, value: string, id: string, numerical_value?: string) {

    if (key === 'period') {// @ts-ignore
      this.new_habit.period = value;
    } else if (key === 'type') {// @ts-ignore
      this.new_habit.type = value;
      if (value == 'numeric') this.new_habit.targetValue = Number(numerical_value);
      else this.new_habit.targetValue = 1;
    }

    this.closeMenu(id);
  }

  getGoalValue(): string {
    let result = this.new_habit.type;
    if (this.new_habit.type == 'numeric') result += `, ${String(this.new_habit.targetValue)}`;
    return result;
  }

  setNewHabitToDefault() {
    this.new_habit = {
      id: Number(this.localstorage_service.get('last-habit-id')),
      title: '',
      period: 'daily',
      addDate: new Date(),
      deletedDate: new Date(),
      type: 'boolean',
      targetValue: 0,
      doneValue: 0,
    };
    this.frequency_date_type_chose = 'daily';
    this.target_value = '';
    this.goal_type_chose = 'boolean';
  }

  addNewHabit() {
    if (this.new_habit.type == 'boolean') this.new_habit.targetValue = 1;
    let string_habit = this.localstorage_service.convertJsonToString(this.new_habit);
    this.localstorage_service.push('habits', string_habit);
    this.closeMenu('add-habit-menu');
    this.get_all_habits();
    this.localstorage_service.set('last-habit-id', String(Number(this.localstorage_service.get('last-habit-id')) + 1));
    this.setNewHabitToDefault();
  }

  get_time() {
    const now = Number(new Date().toTimeString().substring(0, 2));
    if (now <= 6) return "night";
    else if (now <= 12) return "morning";
    else if (now <= 17) return "afternoon";
    else return "evening";
  }

  get_date() {
    let date = this.current_date_service.get_date().split('-');
    return `${date[2]}th ${this.current_date_service.months[Number(date[1])]} ${date[0]}`
  }

  update_percent() {
    for (const habit of this.all_habits) {
      let percent = 120 - habit.doneValue! / Number(habit.targetValue!) * 120;
      document.getElementById(`habit-circle${habit.id}`)!.style.strokeDashoffset = String(percent);
      if (percent == 0) {
        document.getElementById(`habit-circle${habit.id}`)!.classList.add('complete');
        document.getElementById('habit-tick' + habit.id)!.classList.add('complete');
      } else {
        document.getElementById(`habit-circle${habit.id}`)!.classList.remove('complete');
        document.getElementById(`habit-tick${habit.id}`)!.classList.remove('complete');
      }
    }
  }

  openHabitMenu(habit: HabitModel) {
    const menu = document.getElementById('habit-container' + habit.id)!;
    if (this.watching_date != this.date_service.get_date()) {
      menu.classList.add('cancel-opening');
      setTimeout(() => {
        menu.classList.remove('cancel-opening');
      }, 300);
      return;
    }
    if (this.opened_habit_id == habit.id) {
      this.closeHabitMenu();
      return;
    }
    if (this.opened_habit_id != -1) this.closeHabitMenu();
    this.opened_habit_id = habit.id;
    menu.style.height = 'var(--height-opened)';
  }

  closeHabitMenu() {
    const menu = document.getElementById('habit-container' + this.opened_habit_id)!;
    this.opened_habit_id = -1;
    menu.style.height = 'var(--height)';
  }

  submitHabitProgress(habit: HabitModel) {
    if (habit.doneValue == habit.targetValue) {
      this.profile_service.add_completed_habits_count(-1);
      this.profile_service.add_level_point(-1);
      this.profile_service.add_money(-1);
    }

    if (habit.type == 'numeric') {
      // @ts-ignore
      const value: string = document.getElementById('habit-input' + habit.id)!.value;
      habit.doneValue = Number(value);
    } else {
      // @ts-ignore
      const value = document.getElementById('habit-checkbox' + habit.id)!.checked;
      habit.doneValue = value ? 1 : 0;
    }

    if (habit.doneValue == habit.targetValue) {
      this.profile_service.add_completed_habits_count(1);
      this.profile_service.add_level_point(1);
      this.profile_service.add_money(1);
    }

    this.closeHabitMenu();
    let string_value = this.localstorage_service.convertJsonArrayToString(this.all_habits);
    this.localstorage_service.set('habits', string_value);
    this.done_value_service.setByHabit(this.current_date_service.get_date(), habit);

    this.get_all_habits();
  }

  deleteHabit(ignore: boolean = false) {
    // @ts-ignore
    const delete_all = document.getElementById('delete-all')!.checked;

    let habit = this.deleting_habit;
    habit.addDate = (habit.addDate).toJSON().split('T')[0];
    this.localstorage_service.delete('habits', this.localstorage_service.convertJsonToString(habit));
    if (!delete_all && !ignore) {
      habit.deletedDate = this.current_date_service.get_date();
      if (habit.deletedDate > habit.addDate)
        this.localstorage_service.push('deleted-habits', this.localstorage_service.convertJsonToString(habit));
    } else {
      this.localstorage_service.delete('deleted-habits', this.localstorage_service.convertJsonToString(habit));
    }
    this.closeHabitMenu();
    this.closeMenu('bg');
    this.closeMenu('delete-habit-menu');
    this.get_all_habits();
    this.get_deleted_habits();
  }

  scrollToSelectedDate() {
    const rollbar = document.getElementById('rollbar')!;
    const element = document.getElementById('date-card' + this.watching_date)!;
    const window_width = window.innerWidth < 750 ? window.innerWidth : window.innerWidth - 300;
    rollbar.scrollTo({
      left: element.offsetLeft - (window_width - 64) / 2,
      behavior: 'smooth',
    });
  }

  setDate(date: DateCard) {
    this.watching_date = date.date.toJSON().split('T')[0];
    this.scrollToSelectedDate();
    this.get_all_habits();
    this.get_deleted_habits();
    setTimeout(() => {
      this.update_percent();
    });
  }

  checkDeleted(id: string) {
    // @ts-ignore
    document.getElementById('delete-prev').checked = false;
    // @ts-ignore
    document.getElementById('delete-all').checked = false;
    // @ts-ignore
    document.getElementById(id).checked = true;
  }

  openDeleteHabitMenu(habit: HabitModel) {
    this.openMenu('bg');
    this.openMenu('delete-habit-menu');
    this.deleting_habit = habit;
  }

  setSelectedCollection() {
    // @ts-ignore
    const collection_name = document.getElementById('first-select')!.value;
    if (collection_name == '') this.selected_collection = [];
    else this.selected_collection = this.ready_habits_service.get_collection(collection_name).habits;
  }

  selectNewHabit() {
    // @ts-ignore
    const title = document.getElementById('second-select')!.value;
    let habit = this.ready_habits_service.get_habit(title);
    this.new_habit.title = habit.title;
    this.new_habit.targetValue = habit.targetValue;
    this.new_habit.type = habit.type;
    this.new_habit.addDate = this.current_date_service.get_date();
    this.new_habit.period = habit.period;
    this.new_habit.deletedDate = habit.deletedDate;
    this.new_habit.doneValue = 0;
  }
}
