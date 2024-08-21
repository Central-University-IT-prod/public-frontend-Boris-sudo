import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {CurrentDateService} from "../../services/current-date.service";
import {LoaderComponent} from "../loader/loader.component";
import {LocalstorageMethodsService} from "../../services/localstorage-methods.service";
import {HabitModel} from "../../modules/habit.model";
import {DoneValueService} from "../../services/done-value.service";

@Component({
  selector: 'app-for-testing',
  templateUrl: './for-testing.component.html',
  styleUrls: ['./for-testing.component.css']
})
export class ForTestingComponent implements OnInit {
  public all_habits: HabitModel[] = [];

  constructor(
    private profile_service: ProfileService,
    private date_service: CurrentDateService,
    private localstorage: LocalstorageMethodsService,
    private done_value_service: DoneValueService,
  ) {
  }

  ngOnInit(): void {
    // @ts-ignore
    document.getElementById('for-testing-date-input')!.value = this.date_service.get_date();
  }

  upload_habits_file() {
    LoaderComponent.show_loader();
    const file_container = document.getElementById('file-container')!;
    // @ts-ignore
    const file = file_container.files[0];

    let reader = new FileReader();
    reader.onload = () => {
      // @ts-ignore
      const json = JSON.parse(reader.result);
      for (const habit of json.habits) {
        let habit_model: HabitModel = {
          id: habit.id,
          title: habit.title,
          period: habit.period,
          addDate: habit.addDate.split('T')[0],
          deletedDate: new Date(),
          type: habit.targetValue == undefined? "boolean" : "numeric",
          targetValue: habit.targetValue == undefined? 1 : habit.targetValue,
          doneValue: 0,
        }
        this.localstorage.push('habits', this.localstorage.convertJsonToString(habit_model));
      }

      this.get_all_habits();

      for(const action of json.actions)
        for (const habit of this.all_habits)
          if (Number(action.id) == habit.id) {
            habit.doneValue = action.value == undefined? 1 : action.value;
            this.done_value_service.setByHabit(action.date.split('T')[0], habit);
          }

      LoaderComponent.hide_loader();
    }
    reader.readAsText(file);
  }

  get_all_habits() {
    const string_value = this.localstorage.get('habits');
    const habits: HabitModel[] = this.localstorage.toJson("[" + string_value + "]");
    this.all_habits = [];
    for (const habit of habits) {
      habit.addDate = new Date(habit.addDate);
      habit.deletedDate = new Date(habit.deletedDate);
      this.all_habits.push(habit);
    }

    for (let i = 0; i < this.all_habits.length; i++) {
      this.all_habits[i].targetValue = Number(this.all_habits[i].targetValue);
    }
  }


  add_levels(levels_count: number) {
    this.profile_service.add_levels(levels_count);
  }

  add_money(money_count: number) {
    this.profile_service.add_money_with_count(money_count);
  }

  set_date() {
    // @ts-ignore
    const date = document.getElementById('for-testing-date-input')!.value;
    if (date != undefined)
      this.date_service.set_date(date);
  }
}
