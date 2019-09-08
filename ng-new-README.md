# Standard Angular CLI app converted to Bazel

1. Generate new app
```bash
ng new ng-new-my-app
```

2. Build new app
```bash
cd ng-new-may-app && \
ng build
# or
yarn run build
```

3. Verify main.ts
```typescript
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
```

4. Verify /dist
```
# $ ls -1a ./dist/ng-new-my-app/
.
..
favicon.ico
index.html
main-es2015.js
main-es2015.js.map
main-es5.js
main-es5.js.map
polyfills-es2015.js
polyfills-es2015.js.map
polyfills-es5.js
polyfills-es5.js.map
runtime-es2015.js
runtime-es2015.js.map
runtime-es5.js
runtime-es5.js.map
styles-es2015.js
styles-es2015.js.map
styles-es5.js
styles-es5.js.map
vendor-es2015.js
vendor-es2015.js.map
vendor-es5.js
vendor-es5.js.map
```

5. Add Angular Compiler
Add to "scripts" in package.json

```json
"scripts": {
  "compile": "ngc"
}`
```

Run
```bash
yarn run compile
```

Check your output (refer to `tsconfig.json#outDir`)
```
"outDir": "./dist/out-tsc/src/app",
```
```bash
$ ls -1a
.
..
app-routing.module.js
app-routing.module.js.map
app-routing.module.metadata.json
app-routing.module.ngfactory.js
app-routing.module.ngfactory.js.map
app-routing.module.ngsummary.json
app.component.js
app.component.js.map
app.component.metadata.json
app.component.ngfactory.js
app.component.ngfactory.js.map
app.component.ngsummary.json
app.component.scss.shim.ngstyle.js
app.component.scss.shim.ngstyle.js.map
app.component.spec.js
app.component.spec.js.map
app.component.spec.ngsummary.json
app.module.js
app.module.js.map
app.module.metadata.json
app.module.ngfactory.js
app.module.ngfactory.js.map
app.module.ngsummary.json
```

6. [Add Bazel](https://angular.io/guide/bazel)
```bash
ng add @angular/bazel
```

Changes: https://github.com/conalryan/bazel/compare/b52703e1fff6aba49b69437bf4646f0087d28737...237e66538171e5e2ada825652e08a9afaf94c9d9

7. Build
```bash
ng build
# or
yarn run build
```

Note main.ts is replaced by 
`main.dev.ts`
````typescript

import {platformBrowser} from '@angular/platform-browser';
import {AppModuleNgFactory} from './app/app.module.ngfactory';

platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
````
and
`main.prod.ts`
````typescript
import {enableProdMode} from '@angular/core';
import {platformBrowser} from '@angular/platform-browser';
import {AppModuleNgFactory} from './app/app.module.ngfactory';

enableProdMode();
platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);
````

8. Run
```bash
ng serve
# or
yarn run start
```

9. Run
```bash
yarn run postinstall
```

10. Run
````bash
ng build --leaveBazelFilesOnDisk
````

11. Add ng-bootstrap
```bash
yarn add @ng-bootstrap/ng-bootstrap
# or
# npm install --save @ng-bootstrap/ng-bootstrap
```
