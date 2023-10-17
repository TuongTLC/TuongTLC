import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ErrorPageComponent } from './pages/error-page/error-page.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { WelcomePageComponent } from './pages/welcome-page/welcome-page.component';
import { LoginPageComponent } from './pages/login-page/login-page.component';
import { RegisterPageComponent } from './pages/register-page/register-page.component';
import { AboutPageComponent } from './pages/about-page/about-page.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopupModalComponent } from './components/popup-modal/popup-modal.component';
import { PasswordPageComponent } from './pages/password-page/password-page.component';
import { UserInfoPageComponent } from './pages/user-info-page/user-info-page.component';
import { NgxEditorModule } from 'ngx-editor';
import { SanitizeHtmlPipes } from './sanitizer';
import { CreatePageComponent } from './pages/create-page/create-page.component';
import { ClipboardModule } from 'ngx-clipboard';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PostPageComponent } from './pages/post-page/post-page.component';
import { ListViewComponent } from './pages/list-view/list-view.component';
import { EditPostPageComponent } from './pages/edit-post-page/edit-post-page.component';
import { AdminConsoleComponent } from './pages/admin-console/admin-console.component';

@NgModule({
  declarations: [
    WelcomePageComponent,
    HomePageComponent,
    ErrorPageComponent,
    NavbarComponent,
    WelcomePageComponent,
    LoginPageComponent,
    RegisterPageComponent,
    AboutPageComponent,
    PopupModalComponent,
    PasswordPageComponent,
    UserInfoPageComponent,
    SanitizeHtmlPipes,
    CreatePageComponent,
    PostPageComponent,
    ListViewComponent,
    EditPostPageComponent,
    AdminConsoleComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    NgxEditorModule,
    ReactiveFormsModule,
    ClipboardModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [NavbarComponent],
})
export class AppModule {}
