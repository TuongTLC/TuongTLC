import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-popup-modal',
  templateUrl: './popup-modal.component.html',
  styleUrls: ['./popup-modal.component.css'],
})
export class PopupModalComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() closeShow = '0';

  @Output() close = new EventEmitter<boolean>();
  action = true;
  ok() {
    this.action = true;
    this.close.emit(this.action);
  }

  cancel() {
    this.action = false;
    this.close.emit(this.action);
  }
}
