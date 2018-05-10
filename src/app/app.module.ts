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
    const bundles = ['my-first-element-ng', 'my-other-element-ng'];

    bundles
      .forEach(name => document.body.appendChild(this.getScriptTag(name)));

  }

  getScriptTag(fileName: string) {
    document
      .createElement(`script`);
    scriptTag.setAttribute('src', `assets/elements/${fileName}.js`);
    scriptTag.setAttribute('type', 'text/javascript');
  }

}
