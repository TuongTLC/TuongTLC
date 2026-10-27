import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { PasswordPageComponent } from './pages/password-page/password-page.component';
import { UserInfoPageComponent } from './pages/user-info-page/user-info-page.component';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { ListViewComponent } from './pages/list-view/list-view.component';
import { EditPostPageComponent } from './pages/edit-post-page/edit-post-page.component';
import { AdminConsoleComponent } from './pages/admin-console/admin-console.component';
import { PreviewPostComponent } from './pages/preview-post/preview-post.component';
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'home', component: HomePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'about', component: AboutPageComponent },
  { path: 'create', component: CreatePageComponent, canActivate: [AuthGuard] },
  { path: 'post', component: PostPageComponent },
  { path: 'user-info', component: UserInfoPageComponent, canActivate: [AuthGuard] },
  { path: 'password', component: PasswordPageComponent, canActivate: [AuthGuard] },
  { path: 'list-view', component: ListViewComponent, canActivate: [AuthGuard] },
  { path: 'edit-post', component: EditPostPageComponent, canActivate: [AuthGuard] },
  { path: 'admin-console', component: AdminConsoleComponent, canActivate: [AdminGuard] },
  { path: 'preview-post', component: PreviewPostComponent },
  { path: '**', component: ErrorPageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
