import { Component, OnInit } from '@angular/core';
import {LocalstorageMethodsService} from "../../services/localstorage-methods.service";
import {RoutingService} from "../../services/routing-service.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  public username: string = '';

  constructor(
    private localstorage: LocalstorageMethodsService,
    private router: RoutingService,
  ) {
  }

  ngOnInit(): void {
  }

  login() {
    this.localstorage.set('user', this.username);
    this.router.navigate('').then();
  }
}
