import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-other-element',
  templateUrl: './other-element.component.html',
  styleUrls: ['./other-element.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class OtherElementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
