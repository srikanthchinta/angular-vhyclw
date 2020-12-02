import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'EAD-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrls: ['./confirmation-dialog.component.scss']
})
export class ConfirmationDialogComponent implements OnInit {
  @Output() closeConfirmationPopUp = new EventEmitter<boolean>();
  confirmationMessageText: string;
  constructor() { }

  ngOnInit() {
  }

  setConfirmationMessageText(confirmationMessageText: string): void {
    this.confirmationMessageText = confirmationMessageText;
  }

  closeConfirmation(confirmed: boolean): void {
    this.closeConfirmationPopUp.next(confirmed);
  }
}
