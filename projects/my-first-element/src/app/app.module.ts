import { BrowserModule } from '@angular/platform-browser';
import {Injector, NgModule} from '@angular/core';
import { FirstElementComponent } from './first-element/first-element.component';
import {createCustomElement, NgElementConfig} from '@angular/elements';

@NgModule({
  declarations: [FirstElementComponent],
  imports: [BrowserModule],
  entryComponents: [FirstElementComponent]
})
export class AppModule {
  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const config: NgElementConfig = {injector: this.injector};
    const ngElement = createCustomElement(FirstElementComponent, config);

    customElements.define('app-first-element', ngElement);
  }

}
