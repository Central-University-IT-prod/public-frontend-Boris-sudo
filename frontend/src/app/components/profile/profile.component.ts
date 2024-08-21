import {AfterViewInit, Component, OnInit} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {AvatarService} from "../../services/avatar.service";
import {LocalstorageMethodsService} from "../../services/localstorage-methods.service";
import {BackgroundService} from "../../services/backgrounds.service";
import {Achievement, AchievementsService} from "../../services/achievements.service";
import {LoaderComponent} from "../loader/loader.component";
import {CurrentDateService} from "../../services/current-date.service";
import {RoutingService} from "../../services/routing-service.service";
import {Profile} from "../../modules/profile.model";
import {Avatar} from "../../modules/avatar.model";
import {Background} from "../../modules/background.model";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  public profile: Profile = {};
  public avatar: Avatar = {cost: 0, path: ''};
  public background: Background = {cost: 0, color: '', edit_color: ''};
  public achievements: Achievement[] = [];
  public username: string = '';

  constructor(
    private date_service: CurrentDateService,
    private achievements_service: AchievementsService,
    private localstorage: LocalstorageMethodsService,
    private profile_service: ProfileService,
    private avatar_service: AvatarService,
    private background_service: BackgroundService,
    private router: RoutingService,
  ) {
  }

  ngOnInit(): void {
    LoaderComponent.show_loader();

    this.get_info();
    this.date_service.subscriber$.subscribe(() => {
      this.get_info();
    })
  }

  ngAfterViewInit() {
    const body = document.getElementById('body')!;
    body.style.setProperty('--profile-top-color', this.background.color);
    body.style.setProperty('--edit-image-color', this.background.edit_color);

    document.fonts.ready.then(() => {
      LoaderComponent.hide_loader();
    });
  }

  get_info() {
    this.profile = this.profile_service.get();
    this.avatar = this.avatar_service.get_by_id(this.profile.avatar_id!);
    this.background = this.background_service.get_by_id(this.profile.background_id!);
    this.username = this.localstorage.get('user');
    this.achievements = this.achievements_service.get_achievements();
  }

  open_profile_image_chose_menu() {
    this.router.navigate('settings/avatar').then();
  }
}
