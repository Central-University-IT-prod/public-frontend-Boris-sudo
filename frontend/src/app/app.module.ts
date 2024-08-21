import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { RightBarComponent } from './components/right-bar/right-bar.component';
import { TopBarComponent } from './components/top-bar/top-bar.component';
import { LoaderComponent } from './components/loader/loader.component';
import { AddHabitPageComponent } from './components/add-habit-page/add-habit-page.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import {FormsModule} from "@angular/forms";
import { ProfileComponent } from './components/profile/profile.component';
import { AchievementLevelUpComponent } from './components/achievement-level-up/achievement-level-up.component';
import { ShopComponent } from './components/shop/shop.component';
import { ChoosingAvatarComponent } from './components/choosing-avatar/choosing-avatar.component';
import { HubComponent } from './components/hub/hub.component';
import { ForTestingComponent } from './components/for-testing/for-testing.component';
import { GraphicsComponent } from './components/graphics/graphics.component';

@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent,
    RightBarComponent,
    TopBarComponent,
    LoaderComponent,
    AddHabitPageComponent,
    LoginPageComponent,
    ProfileComponent,
    AchievementLevelUpComponent,
    ShopComponent,
    ChoosingAvatarComponent,
    HubComponent,
    ForTestingComponent,
    GraphicsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
