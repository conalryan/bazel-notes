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

12. Add ng-alert to app.component.html
```html
<ngb-alert [dismissible]="false">
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</ngb-alert>
```

13. Add NgbModule to app.module
```ts
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
// ...
imports: [
  //...
  NgbAlertModule,
  //...
]
```

```
$ ng build
INFO: Analyzed target //src:prodapp (163 packages loaded, 2118 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: Compiling Angular templates (ngc) //src:
src failed (Exit 1)
src/app/app.module.ts(7,30): error TS2307: Cannot find module '@ng-bootstrap/ng-bootstrap'.

Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 12.420s, Critical Path: 9.77s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/bazel/ng-new-my-app/node_modules/@bazel/bazel/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
```

Add `"@npm//@ng-bootstrap/ng-bootstrap",` to BUILD.bazel

````
$ ng build
INFO: Analyzed target //src:prodapp (516 packages loaded, 19963 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: Compiling Angular templates (ngc) //src:
src failed (Exit 1)
Unexpected value 'NgbAlertModule in /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/p
roject/external/npm/node_modules/@ng-bootstrap/ng-bootstrap/ng-bootstrap.d.ts' imported by the module 'AppModule in /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project/src/app/app.module.ts'. Please add a @NgModule annotation.
Can't bind to 'dismissible' since it isn't a known property of 'ngb-alert'.
1. If 'ngb-alert' is an Angular component and it has 'dismissible' input, then verify that it is part of this module.
2. If 'ngb-alert' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message.
3. To allow any property add 'NO_ERRORS_SCHEMA' to the '@NgModule.schemas' of this component. ("
</div>

<ngb-alert [ERROR ->][dismissible]="false">
  <strong>Warning!</strong> Better check yourself, you're not looking too good")
'ngb-alert' is not a known element:
1. If 'ngb-alert' is an Angular component, then verify that it is part of this module.
2. If 'ngb-alert' is a Web Component then add 'CUSTOM_ELEMENTS_SCHEMA' to the '@NgModule.schemas' of this component to suppress this message. ("
</div>

[ERROR ->]<ngb-alert [dismissible]="false">
  <strong>Warning!</strong> Better check yourself, you're not looki")

Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 18.433s, Critical Path: 8.27s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/bazel/ng-new-my-app/node_modules/@bazel/bazel/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
````

Add `"node_modules/@ng-bootstrap/**/*"` to BUILD.bazel
Run
````bash
yarn run postinstall && \
ng build
````

````
$ ng build
INFO: Analyzed target //src:prodapp (516 packages loaded, 19963 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: Compiling Angular templates (ngc) //src:
src failed (Exit 1)
src/main.dev.ts(2,9): error TS2305: Module '"./app/app.module.ngfactory"' has no exported member 'AppModuleNg
Factory'.
src/main.prod.ts(3,9): error TS2305: Module '"./app/app.module.ngfactory"' has no exported member 'AppModuleNgFactory'.

Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 16.389s, Critical Path: 8.24s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/bazel/ng-new-my-app/node_modules/@bazel/bazel/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
````

Try relative path
main.dev.ts and main.prod.ts
````typescript
// import {AppModuleNgFactory} from './app/app.module.ngfactory';
import {AppModuleNgFactory} from '../dist/out-tsc/src/app/app.module.ngfactory.js';
````

````
$ ng build
INFO: Analyzed target //src:prodapp (0 packages loaded, 0 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: Compiling Angular templates (ngc) //src:
src failed (Exit 1)
src/main.dev.ts(3,34): error TS2307: Cannot find module '../dist/out-tsc/src/app/app.module.ngfactory.js'.
src/main.prod.ts(4,34): error TS2307: Cannot find module '../dist/out-tsc/src/app/app.module.ngfactory.js'.

Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 6.777s, Critical Path: 6.15s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/bazel/ng-new-my-app/node_modules/@bazel/bazel/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
````

Remove node_modules and reinstall
````bash
rm -rf node_modules && yarn install
````

````
$ ng build
INFO: Analyzed target //src:prodapp (516 packages loaded, 19963 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/dist/source-map
.debug.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/base64.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/binary-sear
ch.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/mapping-lis
t.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-
generator.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.debug.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/base64.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/binary-search.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/mapping-list.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-generator.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/dist/source-map
.debug.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/base64.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/binary-sear
ch.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/mapping-lis
t.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-
generator.js'
Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:49:1 5 input file(s) do not exist
INFO: Elapsed time: 10.662s, Critical Path: 0.01s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/bazel/ng-new-my-app/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
````

````
Executing task: bazel 'build' '//src:src' <

INFO: Analyzed target //src:src (0 packages loaded, 0 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-new-my-app -> /private/var/tmp/_bazel_cryan/1bff8637f729aa6b3b710bff46314c06/execroot/project:  /Users/cryan/code/p/bazel/ng-new-my-app/dist/ng-new-my-app (File exists)
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.debug.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.min.js'ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/array-set.j
s'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/base64-vlq.
js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/base64.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/binary-sear
ch.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/mapping-lis
t.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/quick-sort.
js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-
consumer.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-
generator.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/source-node
.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/lib/util.js'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/package.json'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/source-map.d.ts
'
ERROR: missing input file '@npm//:node_modules/@types/webpack-sources/node_modules/source-map/source-map.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.debug.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/dist/source-map.min.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/array-set.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/base64-vlq.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/base64.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/binary-search.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/mapping-list.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/quick-sort.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-consumer.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/source-map-generator.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/source-node.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/lib/util.js'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/package.json'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/source-map.d.ts'
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1: //src:src: missing input file '@npm//:no
de_modules/@types/webpack-sources/node_modules/source-map/source-map.js'
Target //src:src failed to build
Use --verbose_failures to see the command lines of failed build steps.
ERROR: /Users/cryan/code/p/bazel/ng-new-my-app/src/BUILD.bazel:24:1 16 input file(s) do not exist
INFO: Elapsed time: 0.436s, Critical Path: 0.00s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
The terminal process terminated with exit code: 1
````

