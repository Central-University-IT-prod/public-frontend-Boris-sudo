import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription, switchMap, timer} from "rxjs";
import {ProfileService} from "./services/profile.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'TODODO';
  subscriptions !: Subscription;

  constructor(
    private profile_service: ProfileService,
  ) {
  }

  ngOnInit() {
    this.subscriptions = timer(0, this.profile_service.notification_time).pipe(
      switchMap(() => this.profile_service.notification())
    ).subscribe(() => {});
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  getWindowSize() {
    return window.innerWidth;
  }
}
