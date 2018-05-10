import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-first-element',
  templateUrl: './first-element.component.html',
  styleUrls: ['./first-element.component.css'],
  encapsulation: ViewEncapsulation.Native
})
export class FirstElementComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
