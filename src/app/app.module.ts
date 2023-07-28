import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './home-page/home-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { NavbarComponent } from './navbar/navbar.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { TutorialsPageComponent } from './tutorials-page/tutorials-page.component';
import { TipsPageComponent } from './tips-page/tips-page.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { RegisterPageComponent } from './register-page/register-page.component';

@NgModule({
  declarations: [
    WelcomePageComponent,
    HomePageComponent,
    ErrorPageComponent,
    NavbarComponent,
    WelcomePageComponent,
    TutorialsPageComponent,
    TipsPageComponent,
    LoginPageComponent,
    RegisterPageComponent,
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [NavbarComponent],
})
export class AppModule {}
