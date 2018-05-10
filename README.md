# Angular Elements Build Setup

The dev-kit has a package available for building webcomponents with angular. 
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
... 
  depenencies: {
    ...
    "@angular/elements": "^6.0.0",
    "document-register-element": "^1.7.2"
  }
...
}
```

And add a script to your projects scripts config in `angular.json`:

```json
// angular.json
{
...
  "projects": {
    "ng-elements-poc": {
    ...
      "scripts": [
        {
          "input": "node_modules/document-register-element/build/document-register-element.js"
        }
      ],
      ...
    },
    ...
  },
  ...
}
```

3. Test the if everything is still working: `ng serve`

## Setup application for standalone web component

1. Generate a new project in which we can test an elements setup.
Run `ng generate application my-first-elements` in the console.

2. Copy the script in your `angular.json` (mentioned in step `Setup WebComponents:1.`) from project `ng-elements-poc` to `my-first-element` scripts:  

```json
// angular.json
{
...
  "projects": {
    ...
    "my-first-element": {
    ...
      "scripts": [
        {
          "input": "node_modules/document-register-element/build/document-register-element.js"
        }
      ],
      ...
    },
    ...
  },
  ...
}
```

3. Test it: `ng serve --project my-first-element`

4. Setup a script in your `package.json` to start the `my-first-element` application:

```json
{
  ... 
  scripts: {
  ...
   "first-element:start": "ng serve --project my-first-element",
  },
  ...
}
```

5. Test it by running `npm run first-element:start`.

6. Now lets create a build task that we can use later on to generate the bundled web component file. 
   Setup a script in your `package.json` to build the application. 
   Note that we set the flag `output-hashing` to `none` to have the bundles always with the same file names.

```json
{
  ... 
  scripts: {
  ...
   "first-element:build": "ng build --prod --project my-first-element --output-hashing=none"
  },
  ...
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
import {Injector, ...} from '@angular/core';
import {createCustomElement, NgElementConfig} from '@angular/elements';

@NgModule({
... 
})
export class AppModule {
  constructor(private injector: Injector) {

  }

  ngDoBootstrap() {
    const config: NgElementConfig = {injector: this.injector};
    const ngElement = createCustomElement(FirstElementComponent, config);

    customElements.define('first-element', ngElement);
  }

}
```

3. In your `index.html` replace ```html<app-root></app-root>``` with ```html<first-element></first-element>```

4. Test your web component. 
Run `npm run first-element:start`

## Setup for IE

1. In your `angular.json` remove the a scripts your `my-elements` `scripts` section. 
It will fail in IE/Edge. 

```json
{
  ...
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

# Test web component in another angular app

## Tooling

1. Copy your `my-elements` polyfill file and name it `polyfills.standalone.ts`.

2. In `polyfills.ts` remove the polyfill for `zone.js`

```typescript
// vvv REMOVE vvv
// import 'zone.js/dist/zone';  // Included with Angular CLI.
```

3. In your `angular.json` in `projects` copy the whole `my-elements` part and rename it to `my-elements-standalone`
Under polyfills use the `polyfills.standalone.ts` instead of `polyfills.ts`
```json
{
  "projects": {
    "my-elements-standalone" : {
      ...
      "architect": {
        "build": {
          ... 
          "options": {
            "polyfills": "projects/elements/src/polyfills.standalone.ts",
            ... 
           }
        }
      }
    }
  }
}
```
  
3. Setup new script in `package.json` to build the standalone version

```json
  ... 
  "element:build:standalone": "ng build --project=my-elements-standalone --prod --output-hashing=none",
```

4. Setup new script in `package.json` to bundle the files compiled files from the build into one

```json
{
  ...
  "element:build:standalone": "ng build --project=elements-standalone --prod --output-hashing=none"
}
```

5. Run `npm run element:bundle` in the console to test it


## Implementation

1. Copy `elements.js` into the assets folder.

2. 

2. In your root application `ng-elements-poc` open `app.module.ts`
Insert following code to `AppModule`

```typescript
export class AppModule {

  constructor() {
    const scriptTag = document
          .createElement(`script`);
        scriptTag.setAttribute('src', 'assets/elements/elements.js');
        scriptTag.setAttribute('type', 'text/javascript');

    document.body.appendChild(scriptTag);
  }

}
```
