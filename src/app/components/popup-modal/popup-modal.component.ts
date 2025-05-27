import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-popup-modal',
    templateUrl: './popup-modal.component.html',
    styleUrls: ['./popup-modal.component.css'],
    standalone: false
})
export class PopupModalComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() closeShow = '0';

  @Output() closeEvt = new EventEmitter<boolean>();
  action = true;
  ok() {
    this.action = true;
    this.closeEvt.emit(this.action);
  }

  cancel() {
    this.action = false;
    this.closeEvt.emit(this.action);
  }
}
