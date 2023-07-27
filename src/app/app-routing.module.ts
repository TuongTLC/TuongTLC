import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { ErrorPageComponent } from './error-page/error-page.component';
const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
