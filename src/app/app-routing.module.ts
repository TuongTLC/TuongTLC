import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './pages/home-page/home-page.component';
import {WelcomePageComponent} from './pages/welcome-page/welcome-page.component';
import {ErrorPageComponent} from './pages/error-page/error-page.component';
import {LoginPageComponent} from './pages/login-page/login-page.component';
import {RegisterPageComponent} from './pages/register-page/register-page.component';
import {TutorialsPageComponent} from './pages/tutorials-page/tutorials-page.component';
import {TipsPageComponent} from './pages/tips-page/tips-page.component';
import {AboutPageComponent} from './pages/about-page/about-page.component';
import {PasswordPageComponent} from './pages/password-page/password-page.component';
import {UserInfoPageComponent} from './pages/user-info-page/user-info-page.component';

const routes: Routes = [
  {path: '', component: WelcomePageComponent},
  {path: 'home', component: HomePageComponent},
  {path: 'login', component: LoginPageComponent},
  {path: 'register', component: RegisterPageComponent},
  {path: 'tutorials', component: TutorialsPageComponent},
  {path: 'tips', component: TipsPageComponent},
  {path: 'about', component: AboutPageComponent},
  {path: 'user-info', component: UserInfoPageComponent},
  {path: 'password', component: PasswordPageComponent},
  {path: '**', component: ErrorPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
