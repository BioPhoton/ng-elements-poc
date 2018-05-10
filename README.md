# Angular Elements Build Setup

The dev-kit has a package available for building web components with angular. 
You can use the `@angular/elements` package for this. 
Here you can follow a step by step setup for angular elements running standalone or in another angular app.

## Setup a new project

1. Create a new project. Run `ng new ng-elements-poc` in the console.

2. Switch into you new directory: `cd ng-elements-poc`

3. You should now be able to test it by running `ng serve --open` in the console.

## Setup WebComponents

1. Run `ng add @angular/elements` in the console.
The cli will install some packages to your `package.json`:

```json
// package.json

{
[...] 
  depenencies: {
    [...]
    "@angular/elements": "^6.0.0",
    "document-register-element": "^1.7.2"
  }
[...]
}
```

And add a script to your projects scripts config in `angular.json`:

```json
// angular.json

{
[...]
  "projects": {
    "ng-elements-poc": {
    [...]
      "scripts": [
        {
          "input": "node_modules/document-register-element/build/document-register-element.js"
        }
      ],
      [...]
    },
    [...]
  },
  [...]
}
```

3. Test the if everything is still working: `ng serve`

## Setup application for standalone web component

1. Generate a new project in which we can test an elements setup.
Run `ng generate application my-first-element` in the console.

2. Copy the script in your `angular.json` (mentioned in step `Setup WebComponents:1.`) from project `ng-elements-poc` to `my-first-element` scripts:  

```json
// angular.json

{
[...]
  "projects": {
    [...]
    "my-first-element": {
    [...]
      "scripts": [
        {
          "input": "node_modules/document-register-element/build/document-register-element.js"
        }
      ],
      [...]
    },
    [...]
  },
  [...]
}
```

3. Test it: `ng serve --project my-first-element`

4. Setup a script in your `package.json` to start the `my-first-element` application:

```json
// package.json

{
  [...] 
  scripts: {
  [...]
   "first-element:start": "ng serve --project my-first-element",
  },
  [...]
}
```

5. Test it by running `npm run first-element:start`.

6. Now lets create a build task that we can use later on to generate the bundled web component file. 
   Setup a script in your `package.json` to build the application. 
   Note that we set the flag `output-hashing` to `none` to have the bundles always with the same file names.

```json
// package.json

{
  [...] 
  scripts: {
  [...]
   "first-element:build": "ng build --prod --project my-first-element --output-hashing=none"
  },
  [...]
}
```

7. Run the command and check the file names in the `dist` folder.

8. You can also test the bundles directly. Therefore lets another package:

Install the `http-server` globally:
`npm install http-server -g`

Now we can run `http-server .\dist\my-first-element\` in our root folder.
As stated in the console we can now access the serve file under `127.0.0.1:8080`.

```
Starting up http-server, serving .\dist\my-first-element\
Available on:
  http://192.168.43.58:8080
  http://127.0.0.1:8080
```

## Create component and bootstrapping

We have setup a new project to test standalone web components. Now lets create one. 

1. Create a component called `first-element` and set `viewEncapsulation` to `Native`:
`ng generate component first-element --project my-first-element --spec=false --viewEncapsulation=Native`

3. Remove AppComponent from you project. 
- delete `app.component.ts`, `app.component.html`, `app.component.css`, `app.component.spec.ts`
- remove all references in `app.module.ts`

4. In `app.module.ts` remove the empty settings and add `FirstElementComponent` to the `entryComponents`

```typescript
// projects/my-first-element/src/app/app.module.ts

import { FirstElementComponent } from './first-element/first-element.component';

@NgModule({
  declarations: [FirstElementComponent],
  imports: [BrowserModule],
  // providers: [],
  // bootstrap: [],
  entryComponents: [FirstElementComponent]
})
```

5. Implement the bootstrapping logic for your component.

```
// projects/my-first-element/src/app/app.module.ts

import {Injector, [...]} from '@angular/core';
import {createCustomElement, NgElementConfig} from '@angular/elements';

@NgModule({
[...] 
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
```

3. In your `index.html` replace `<app-root></app-root>` with `<app-first-element></app-first-element>`:


```html
<!-- projects/my-first-element/src/index.html --> 

[...]
<body>
  <!-- vvv REMOVE vvv
  <app-root></app-root>
  vvv ADD vvv -->
  <app-first-element></app-first-element>
</body>
</html>
``` 

4. Test your web component. 
Run `npm run first-element:start`

5. You can also setup a new script in `package.json` to bundle the files to use your web component in another place.
Let's introduce the `bundle-standalone` script. 

```json
// package.json

{
  [...]
  "first-element:bundle-standalone": "cat dist/my-first-element/{runtime,polyfills,scripts,main}.js > dist/my-first-element/my-first-element-standalone.js",
}
```

6. Run `npm run first-element:bundle-standalone` in the console to test it.


# Test web component in another angular app

1. Setup new script in `package.json` to bundle the files for another angular project

```json
// package.json

{
  [...]
  "first-element:bundle-ng": "cat dist/my-first-element/{runtime,main}.js > dist/my-first-element/my-first-element-ng.js",
}
```

2. Run `npm run first-element:bundle-ng` in the console to test it.

3. Copy `dist/my-first-element/my-first-element-ng.js` into 
`src/assets/ng-elements` to serve this file as an asset of your root project.

4. In your root application `ng-elements-poc` open `app.module.ts`

Add the following to your ngModule decorator:

```

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
```

And insert following code to `AppModule` constructor

```typescript
export class AppModule {

  constructor() {
    const scriptTag = document
          .createElement(`script`);
        scriptTag.setAttribute('src', 'assets/elements/my-first-element-ng.js');
        scriptTag.setAttribute('type', 'text/javascript');

    document.body.appendChild(scriptTag);
  }

}
```

5. Add the html tag into your `app.component.html`
```html
<!-- src/app/app.component.html -->

[...]
<app-first-element></app-first-element>
```

# Using multiple element bundles in one app

Test test if we can use multiple elements we can test **a** multiple elements in the same bundle and **b** multiple elements in different bundles.

Let's start with **b** multiple elements in a different bundle.

1. Create a new project name `my-other-element`. Do this by following the steps from [Setup application for standalone web component]() and [Create component and bootstrapping]()

2. Create npm scripts for copying the files over into `src/assets/elements`

```json
// package.json

{
  [...]
  "first-element:copy-bundle": "cat dist/my-first-element/my-first-element-ng.js > src/assets/ng-elements/my-first-element-ng.js",
  "other-element:copy-bundle": "cat dist/my-other-element/my-other-element-ng.js > src/assets/ng-elements/my-other-element-ng.js",
  "copy-bundles": "npm run first-element:copy-bundle && npm run other-element:copy-bundle"
}
```

2. In your root application `ng-elements-poc` open `app.module.ts`
   
   Refactor the creation of the script into a separate function:
   
   ```typescript
   export class AppModule {
   
     constructor() {
       const bundles = ['my-first-element-ng', 'my-other-element-ng'];
       
       bundles
        .forEach(name => document.body.appendChild(this.getScriptTag(name)));
      
     }
     
     getScriptTag(fileName: string): HTMLElement {
        const scriptTag = document
          .createElement(`script`);
    
        scriptTag.setAttribute('src', `assets/ng-elements/${fileName}.js`);
        scriptTag.setAttribute('type', 'text/javascript');
    
        return scriptTag;
     }
      
   }
   ```
 
5. Add the html tag into your `app.component.html`
```html
<!-- src/app/app.component.html -->

[...]
<app-other-element></app-other-element>
```

6. Test it. Run following commands:

```
npm run first-element:build
npm run first-element:bundle-ng
npm run other-element:build
npm run other-element:bundle-ng
npm run copy-bundles
```

## Setup for IE !!! In progress !!!

1. In your `angular.json` remove the a scripts your `my-elements` `scripts` section. 
It will fail in IE/Edge. 

```json
{
  [...]
  // vvvv REMOVE vvvv
  "scripts": [
    {
      "input": "node_modules/document-register-element/build/document-register-element.js"
    }
  ]
}
```

2. `npm i @webcomponents/custom-elements --save`

3. In the `my-elements` project folder add the below polyfill to your `polyfills.ts`.

```typescript
import '@webcomponents/custom-elements/custom-elements.min.js';
import '@webcomponents/custom-elements/src/native-shim.js'
```
