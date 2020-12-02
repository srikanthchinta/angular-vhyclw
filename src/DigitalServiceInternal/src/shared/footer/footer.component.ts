import { environment } from '../../../../environments/environment';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'EAD-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  environment = environment.environment;
  constructor() { }

  ngOnInit() {
  }
}
