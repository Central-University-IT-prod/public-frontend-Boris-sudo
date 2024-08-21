import {Component, OnInit} from '@angular/core';
import {ProfileService} from "../../services/profile.service";
import {AvatarService} from "../../services/avatar.service";
import {RoutingService} from "../../services/routing-service.service";
import {Profile} from "../../modules/profile.model";
import {Background} from "../../modules/background.model";
import {Avatar} from "../../modules/avatar.model";
import {BackgroundService} from "../../services/backgrounds.service";

@Component({
  selector: 'app-choosing-avatar',
  templateUrl: './choosing-avatar.component.html',
  styleUrls: ['./choosing-avatar.component.css']
})
export class ChoosingAvatarComponent implements OnInit {
  public profile: Profile = {};
  public available_backgrounds: Background[] = [];
  public available_avatars: Avatar[] = [];
  public chosen_avatar: Avatar = {cost: 0, path: ''};
  public chosen_background: Background = {cost: 0, color: '', edit_color: ''};

  public current_page: string = 'Аватар';

  constructor(
    public router: RoutingService,
    private profile_service: ProfileService,
    private backgrounds_service: BackgroundService,
    private avatar_service: AvatarService,
  ) {
  }

  ngOnInit(): void {
    this.profile = this.profile_service.get();
    this.available_backgrounds = this.get_available_backgrounds();
    this.available_avatars = this.get_available_avatars();
    this.chosen_avatar = this.avatar_service.get_by_id(this.profile.avatar_id!);
    this.chosen_background = this.backgrounds_service.get_by_id(this.profile.background_id!);
  }

  get_available_backgrounds(): Background[] {
    let result: Background[] = [];
    for (const id of this.profile.available_backgrounds!)
      result.push(this.backgrounds_service.get_by_id(id));
    return result;
  }

  get_available_avatars(): Avatar[] {
    let result: Avatar[] = [];
    for (const id of this.profile.available_avatars!)
      result.push(this.avatar_service.get_by_id(id));
    return result;
  }

  save_avatar() {
    this.profile.avatar_id = this.avatar_service.get_id(this.chosen_avatar);
    this.profile.background_id = this.backgrounds_service.get_id(this.chosen_background);
    this.profile_service.set(this.profile);
  }

}
