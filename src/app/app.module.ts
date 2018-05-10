import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {

  constructor() {
    const scriptTag = document
      .createElement(`script`);
    scriptTag.setAttribute('src', 'assets/ng-elements/my-first-element-ng.js');
    scriptTag.setAttribute('type', 'text/javascript');

    document.body.appendChild(scriptTag);
  }

}
