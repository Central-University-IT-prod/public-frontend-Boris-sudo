import {AfterViewInit, Component, OnInit} from '@angular/core';
import {CurrentDateService} from "../../services/current-date.service";
import {navBarLinks} from "../../app-routing.module";
import {ProfileService} from "../../services/profile.service";
import {LoaderComponent} from "../loader/loader.component";
import {RoutingService} from "../../services/routing-service.service";
import {Profile} from "../../modules/profile.model";

@Component({
  selector: 'app-right-bar',
  templateUrl: './right-bar.component.html',
  styleUrls: ['./right-bar.component.css']
})
export class RightBarComponent implements OnInit, AfterViewInit {
  public profile:Profile = {};
  public right_bar_links = navBarLinks;
  private switch_date_type?: string = '';

  constructor(
    public router: RoutingService,
    private date_service: CurrentDateService,
    private profile_service: ProfileService,
  ) {
  }

  ngOnInit(): void {
    this.profile = this.profile_service.get();
    this.router.subscribers$.subscribe(() => {
      this.move_nav_background();
    });
    this.profile_service.subscribers$.subscribe(()=>{
      this.profile = this.profile_service.get();
    })
  }

  ngAfterViewInit(): void {
    // @ts-ignore
    document.getElementById('current-data-input')!.value = this.date_service.get_date();
    this.move_nav_background();
  }

  navigate(url: string) {
    this.router.navigate(url).then(() => {
        this.move_nav_background();
      }
    );
  }

  move_nav_background() {
    const nav_bg = document.getElementById('nav-bg')!;
    const url = this.router.get_link();
    let found = false;
    for (const rightBarLink of this.right_bar_links)
      if (rightBarLink.url == url) found = true;
    if (!found) {
      nav_bg.style.opacity = '0';
      setTimeout(() => {
        nav_bg.style.display = 'none';
      }, 500);
    } else {
      const element = document.getElementById('right-bar-nav-item' + url)!;
      nav_bg.style.top = `${element.offsetTop}px`;
      nav_bg.style.left = `${element.offsetLeft}px`;

      nav_bg.style.display = 'block';
      setTimeout(() => {
        nav_bg.style.opacity = '1';
      })
    }
  }

  check_all_habits_done() {
    const are_done = this.profile_service.are_all_done();

    if (!are_done) {
      if (this.profile.freeze_count! > 0) {
        this.profile_service.use_freeze();
        this.profile = this.profile_service.get();
      } else {
        this.show_confirm_menu();
        return;
      }
    }
    this.profile_service.add_daily_streak();
    if (this.switch_date_type == 'prev') this.date_service.prev_day();
    else if (this.switch_date_type == 'next') this.date_service.next_day();
    else this.date_service.set_date(this.switch_date_type!);
    // @ts-ignore
    document.getElementById('current-data-input')!.value = this.date_service.get_date();
  }

  show_confirm_menu() {
    const menu = document.getElementById('date-switch-confirm-menu')!;
    const bg = document.getElementById('confirm-menu-background')!;

    menu.style.display = 'flex';
    bg.style.display = 'block';
    setTimeout(()=>{
      menu.classList.add('show');
      bg.classList.add('show');
    });
  }

  close_confirm_menu() {
    const menu = document.getElementById('date-switch-confirm-menu')!;
    const bg = document.getElementById('confirm-menu-background')!;

    menu.classList.remove('show');
    bg.classList.remove('show');
    setTimeout(()=>{
      menu.style.display = 'none';
      bg.style.display = 'none';
    }, 300);
  }

  confirm() {
    if (this.switch_date_type == 'prev') this.date_service.prev_day();
    else if (this.switch_date_type == 'next') this.date_service.next_day();
    else this.date_service.set_date(this.switch_date_type!);
    // @ts-ignore
    document.getElementById('current-data-input')!.value = this.date_service.get_date();
    this.profile_service.reset_daily_streak();
    this.close_confirm_menu();
  }

  chose_date() {
    LoaderComponent.show_loader();

    const date_input = document.getElementById('current-data-input')!;
    // @ts-ignore
    this.switch_date_type = date_input.value;
    this.check_all_habits_done();

    LoaderComponent.hide_loader();
  }

  next_day() {
    LoaderComponent.show_loader();

    this.switch_date_type = 'next';
    this.check_all_habits_done();

    LoaderComponent.hide_loader();
  }

  prev_day() {
    LoaderComponent.show_loader();

    this.switch_date_type = 'prev';
    this.check_all_habits_done();

    LoaderComponent.hide_loader();
  }
}
