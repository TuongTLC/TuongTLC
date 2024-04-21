import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { VerifyCodeModel } from 'src/app/models/user-models';
import { UserService } from 'src/app/services/user-services';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrls: ['./verify-email.component.css'],
})
export class VerifyEmailComponent {
  constructor(private userService: UserService, private router: Router) {}
  @Input() closeShow = '0';
  @Input() username: string = '';

  @Output() closeEvt = new EventEmitter<boolean>();
  action = true;
  ok() {
    this.action = true;
    this.closeEvt.emit(this.action);
    this.router.navigate(['/login']);
  }

  cancel() {
    this.action = false;
    this.closeEvt.emit(this.action);
  }
  sentCodeOk() {
    this.sentCode = false;
  }
  verifyModel = new VerifyCodeModel();
  verified = false;
  verifyMessage = '';
  verifyCode() {
    this.verifyModel.username = this.username;
    this.userService.verifyCode(this.verifyModel).subscribe({
      next: (res) => {
        this.verifyMessage = res;
        this.verified = true;
      },
      error: (err) => {
        this.verifyMessage = err.error;
      },
    });
  }
  sendNewCodeMessage = '';
  sentCode = false;
  sendNewCode() {
    this.userService.sentNewOtpCode(this.username).subscribe({
      next: (res) => {
        this.sendNewCodeMessage = res;
        this.sentCode = true;
      },
      error: (err) => {
        this.sendNewCodeMessage = err.error;
        this.sentCode = true;
      },
    });
  }
}
