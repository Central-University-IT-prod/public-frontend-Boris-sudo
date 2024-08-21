import {Component, OnInit} from '@angular/core';
import {DoneValueService} from "../../services/done-value.service";
import {LocalstorageMethodsService} from "../../services/localstorage-methods.service";
import {HabitModel} from "../../modules/habit.model";
import {CurrentDateService} from "../../services/current-date.service";
import {RoutingService} from "../../services/routing-service.service";
import {Chart} from "chart.js/auto"
import {LoaderComponent} from "../loader/loader.component";

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {
  public all_habits: HabitModel[] = [];
  public chart: any;
  public chosen_habit?: HabitModel;

  constructor(
    private done_value_service: DoneValueService,
    private localhost: LocalstorageMethodsService,
    private date_service: CurrentDateService,
    public router: RoutingService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader();
    this.get_all_habits();
    this.createChart();
  }

  choose_habit(habit: HabitModel) {
    if (this.chosen_habit == habit) this.chosen_habit = undefined;
    else this.chosen_habit = habit;
    this.chart.destroy();
    this.createChart();
  }

  createChart() {
    let data: { labels: string[], datasets: [{ label: string, data: number[], backgroundColor: string }] } = {
      labels: [],
      datasets: [
        {
          label: "Done values",
          data: [],
          backgroundColor: 'blue',
        }
      ]
    }

    const done_values = this.done_value_service.getALlDontSet();
    let y_labels: string[] = [];
    for (const date in done_values) y_labels.push(date);
    y_labels.sort();
    data.labels = y_labels;
    for (const date of y_labels) {
      let x_count = 0;
      for (const habit_id in done_values[date])
        for (const habit of this.all_habits)
          if (habit.id == Number(habit_id) && done_values[date][habit_id] == habit.targetValue)
            x_count++;
      data.datasets[0].data.push(x_count);
    }

    if (this.chosen_habit !== undefined) {
      data.datasets.push({label: this.chosen_habit.title, data: [], backgroundColor: 'limegreen'})
      for (const date of data.labels) {
        let done_value = Number(this.done_value_service.get(date, this.chosen_habit.id));
        if (done_value == this.chosen_habit.targetValue) { // @ts-ignore
          data.datasets[1].data.push(1);
        }
        else { // @ts-ignore
          data.datasets[1].data.push(0);
        }
      }
    }

    this.chart = new Chart("all_chart", {
      type: "bar",
      data: data,
      options: {
        aspectRatio: 2.5
      }
    });

    LoaderComponent.hide_loader();
  }

  get_all_habits() {
    const string_value = this.localhost.get('habits');
    const habits: HabitModel[] = this.localhost.toJson("[" + string_value + "]");
    this.all_habits = [];
    for (const habit of habits) {
      habit.addDate = new Date(habit.addDate);
      habit.deletedDate = new Date(habit.deletedDate);
      this.all_habits.push(habit);
    }

    for (let i = 0; i < this.all_habits.length; i++) {
      this.all_habits[i].doneValue = this.done_value_service.get(this.date_service.get_date(), this.all_habits[i].id);
      this.all_habits[i].targetValue = Number(this.all_habits[i].targetValue);
    }
  }
}
