import {Component, OnInit} from '@angular/core';
import {AchievementsService} from "../../services/achievements.service";
import {Achievement} from "../../modules/achievement.model";

@Component({
  selector: 'app-achievement-level-up',
  templateUrl: './achievement-level-up.component.html',
  styleUrls: ['./achievement-level-up.component.css']
})
export class AchievementLevelUpComponent implements OnInit {
  public achievement: Achievement = {
    title: 'Богач',
    level: 1,
    have_progress: 0,
    need_progress: [],
    about: '',
    img_path: 'fire.svg',
    to_about: [],
    color: '',
    about_text: ''
  };

  constructor(
    private achievements_service: AchievementsService,
  ) {
  }

  ngOnInit(): void {
    this.achievements_service.subscribers$.subscribe((data) => {
      const main = document.getElementById('achievements-level-up-main')!;
      main.style.display = 'flex';
      setTimeout(()=>{
        main.classList.add('show');
      })
      // @ts-ignore
      this.achievement = data;
    })
  }

  hide_main() {
    const main = document.getElementById('achievements-level-up-main')!;
    main.classList.remove('show');
    setTimeout(()=>{
      main.style.display = 'none';
    }, 300);
  }
}
