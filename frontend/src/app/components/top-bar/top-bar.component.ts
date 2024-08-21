import {Component, OnInit} from '@angular/core';
import {RoutingService} from "../../services/routing-service.service";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrls: ['./top-bar.component.css']
})
export class TopBarComponent implements OnInit {

  constructor(
    private router: RoutingService,
  ) {
  }

  ngOnInit(): void {
  }

  open_menu() {
    const menu = document.getElementById('menu')!;
    const background = document.getElementById('menu-background')!;

    menu.style.display = 'flex';
    background.style.display = 'block';
    setTimeout(() => {
      menu.classList.add('opened')
      background.classList.add('opened');
    });
  }

  close_menu() {
    const menu = document.getElementById('menu')!;
    const background = document.getElementById('menu-background')!;

    menu.classList.remove('opened')
    background.classList.remove('opened');
    setTimeout(() => {
      menu.style.display = 'none';
      background.style.display = 'none';
    }, 500);
  }

  navigate(url: string) {
    this.router.navigate(url).then();
    this.close_menu();
  }
}
