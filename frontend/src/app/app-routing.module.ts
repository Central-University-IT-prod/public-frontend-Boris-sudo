import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MainPageComponent} from "./components/main-page/main-page.component";
import {AddHabitPageComponent} from "./components/add-habit-page/add-habit-page.component";
import {LoginPageComponent} from "./components/login-page/login-page.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {ChoosingAvatarComponent} from "./components/choosing-avatar/choosing-avatar.component";
import {ShopComponent} from "./components/shop/shop.component";
import {HubComponent} from "./components/hub/hub.component";
import {ForTestingComponent} from "./components/for-testing/for-testing.component";
import {GraphicsComponent} from "./components/graphics/graphics.component";

const routes: Routes = [
  {path: '', component: MainPageComponent},
  {path: 'habits', component: AddHabitPageComponent},
  {path: 'shop', component: ShopComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'hub', component: HubComponent},
  {path: 'settings/avatar', component: ChoosingAvatarComponent},
  {path: 'testing', component: ForTestingComponent},
  {path: 'graphics', component: GraphicsComponent},
];

export interface NavBarLink {
  name: string;
  url: string;
}
export const navBarLinks: NavBarLink[] = [
  {name: 'habits', url: 'habits'},
  {name: 'shop', url: 'shop'},
  {name: 'profile', url: 'profile'},
  {name: 'hub', url: 'hub'},
  {name: 'graphics', url: 'graphics'},
  {name: 'for testing', url: 'testing'},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
