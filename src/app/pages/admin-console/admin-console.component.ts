import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-console',
  templateUrl: './admin-console.component.html',
  styleUrls: ['./admin-console.component.css'],
})
export class AdminConsoleComponent {
  activeUsers = true;
  activePosts = false;
  activeCategories = false;
  activeTags = false;
  resetActive() {
    this.activeUsers = false;
    this.activePosts = false;
    this.activeCategories = false;
    this.activeTags = false;
  }
  activateUser() {
    this.resetActive();
    this.activeUsers = true;
  }
  activatePost() {
    this.resetActive();
    this.activePosts = true;
  }
  activateCategory() {
    this.resetActive();
    this.activeCategories = true;
  }
  activateTag() {
    this.resetActive();
    this.activeTags = true;
  }
}
