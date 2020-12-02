import { InformationTypes } from './../../constants/constants';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'EAD-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrls: ['./information-dialog.component.scss']
})

export class InformationDialogComponent implements OnInit {

  @Output() closeInformationPopUp = new EventEmitter<string>();
  errorMessages: string[];
  informationType: number;
  constructor() { }

  ngOnInit() {
  }

  transformMessaages(messages: any[], informationType: InformationTypes = InformationTypes.information): void {
    this.errorMessages = [];
    this.informationType = informationType;
    messages.forEach((element: { message: string; }, index: number) => {
      this.errorMessages[index] = element.message;
    });
  }

  closeInformation(): void {
    this.closeInformationPopUp.next();
  }
}
