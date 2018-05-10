import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';

import { OtherElementComponent } from './other-element/other-element.component';
import {createCustomElement, NgElementConfig} from '@angular/elements';

@NgModule({
  declarations: [
    OtherElementComponent
  ],
  imports: [
    BrowserModule
  ],
  entryComponents: [OtherElementComponent]
})
export class AppModule {
  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const config: NgElementConfig = {injector: this.injector};
    const ngElement = createCustomElement(OtherElementComponent, config);

    customElements.define('app-other-element', ngElement);
  }

}
