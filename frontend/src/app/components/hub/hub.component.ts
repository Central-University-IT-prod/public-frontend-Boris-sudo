import {Component, OnInit} from '@angular/core';
import {AvatarService} from "../../services/avatar.service";
import {FriendProfile} from "../../modules/friend_profile.model";
import {Background} from "../../modules/background.model";
import {Avatar} from "../../modules/avatar.model";
import {BackgroundService} from "../../services/backgrounds.service";

@Component({
  selector: 'app-hub',
  templateUrl: './hub.component.html',
  styleUrls: ['./hub.component.css']
})
export class HubComponent implements OnInit {
  public friend_profiles: FriendProfile[] = [];
  private mock_profile_count = 12;
  private backgrounds: Background[] = [];
  private avatars: Avatar[] = [];

  public tops: FriendProfile[] = [];

  constructor(
    private background_service: BackgroundService,
    private avatar_service: AvatarService,
  ) {
  }

  ngOnInit(): void {
    function randomNumberIndex(max: number) {
      return Math.floor(Math.random() * max);
    }

    this.backgrounds = this.background_service.get();
    this.avatars = this.avatar_service.get();
    for (let i = 0; i < this.mock_profile_count; i++)
      this.friend_profiles.push({
        path: this.avatars[randomNumberIndex(this.avatars.length)].path,
        color: this.backgrounds[randomNumberIndex(this.backgrounds.length)].color,
      });
    for (let i = 0; i < 3; i++)
      this.tops.push({
        path: this.avatars[randomNumberIndex(this.avatars.length)].path,
        color: this.backgrounds[randomNumberIndex(this.backgrounds.length)].color,
      });
  }

}
