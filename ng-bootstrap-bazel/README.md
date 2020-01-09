# Ng-Bootstrap Bazel

1. Init new project
```bash
ng new ng-bootstrap-bazel
# select routing and scss for styles
```

2. Add ng-bootstrap
```bash
yarn add @ng-bootstrap/ng-bootstrap
```

Verify node_modules/@ng-boostrap/ng-bootstrap
```
LICENSE
README.md
accordion
alert
bundles
buttons
carousel
collapse
datepicker
dropdown
esm2015
esm5
fesm2015
fesm5
index.d.ts
modal
ng-bootstrap.d.ts
ng-bootstrap.metadata.json
package.json
pagination
popover
progressbar
rating
tabset
test
timepicker
toast
tooltip
typeahead
util
```

Add ng-alert to app.component.html
```html
<ngb-alert [dismissible]="false">
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</ngb-alert>
```

Add NgbModule to app.module
```typescript
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
// ...
imports: [
  //...
  NgbAlertModule,
  //...
]
```

Build and run
```bash
ng build
ng serve
```

3. Add Bazel
```bash
ng add @angular/bazel
```

Add ng-bootstrap to `angular-metadata.tsconfig.json`
```json
"node_modules/@ng-bootstrap/ng-bootstrap/**/*"
```

Add ng-bootstrap to BUILD.bazel
```bazel
"@npm//@ng-bootstrap/ng-bootstrap",
```

Postinstall task:
Runs ngc on "included" node_modules
```bash
yarn run postinstall
```
After ngc there will be a .ngfactory.js file in the node_module
```
node_modules/@ng-bootstrap/ng-bootstrap
ng-bootstrap.ngfactory.js
```

Build with Bazel via Angular CLI
```bash
ng build --leaveBazelFilesOnDisk
```

```
$ ng build
Another command (pid=23609) is running.  Waiting for it to complete on the server...
INFO: Analyzed target //src:prodapp (525 packages loaded, 19903 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-bootstrap-bazel -> /private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project:  /Users/cryan/code/p/ng-bootstrap-bazel/dist/ng-bootstrap-bazel (File exists)
ERROR: /Users/cryan/code/p/ng-bootstrap-bazel/src/BUILD.bazel:49:1: Bundling JavaScript src/bundle.es2015.js 
[rollup] failed (Exit 1)
[!] (commonjs plugin) Error: Could not resolve import 'project/external/npm/node_modules/@ng-bootstrap/ng-boo
tstrap/ng-bootstrap.ngfactory' from '/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/bundle.es6/src/app/app.module.ngfactory.js'
Error: Could not resolve import 'project/external/npm/node_modules/@ng-bootstrap/ng-bootstrap/ng-bootstrap.ngfactory' from '/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/bundle.es6/src/app/app.module.ngfactory.js'
    at Object.notResolved (/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/_bundle.rollup.conf.js:163:11)
    at /private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/host/bin/external/build_bazel_rules_nodejs/internal/rollup/rollup.runfiles/build_bazel_rules_nodejs_rollup_deps/node_modules/rollup-plugin-commonjs/src/utils.js:20:68

Target //src:prodapp failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 23.467s, Critical Path: 12.06s
INFO: 1 process: 1 worker.
FAILED: Build did NOT complete successfully
/Users/cryan/code/p/ng-bootstrap-bazel/node_modules/@bazel/bazel-darwin_x64/bazel-0.28.1-darwin-x86_64 failed with code 1.
```

Build with Bazel
```bash
bazel build //src:global_stylesheet
# SUCCESS
```

```bash
bazel build //src:styles
# SUCCESS
```

```bash
bazel build //src:src
# SUCCESS
```

```bash
bazel build //src:bundle
# ERROR:
Executing task: bazel 'build' '//src:bundle' <

INFO: Analyzed target //src:bundle (163 packages loaded, 2111 targets configured).
INFO: Found 1 target...
WARNING: failed to create one or more convenience symlinks for prefix 'dist/':
  cannot create symbolic link dist/ng-bootstrap-bazel -> /private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project:  /Users/cryan/code/p/ng-bootstrap-bazel/dist/ng-bootstrap-bazel (File exists)
ERROR: /Users/cryan/code/p/ng-bootstrap-bazel/src/BUILD.bazel:49:1: Bundling JavaScript src/bundle.es2015.js [rollup] failed (Exit 1)
[!] (commonjs plugin) Error: Could not resolve import 'project/external/npm/node_modules/@ng-bootstrap/ng-bootstrap/ng-bootstrap.ngfactory' from '/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/bundle.es6/src/app/app.module.ngfactory.js'
Error: Could not resolve import 'project/external/npm/node_modules/@ng-bootstrap/ng-bootstrap/ng-bootstrap.ngfactory' from '/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/bundle.es6/src/app/app.module.ngfactory.js'
    at Object.notResolved (/private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/darwin-fastbuild/bin/src/_bundle.rollup.conf.js:163:11)
    at /private/var/tmp/_bazel_cryan/cc699828ad36a3b5e8f265dafc60a906/execroot/project/bazel-out/host/bin/external/build_bazel_rules_nodejs/internal/rollup/rollup.runfiles/build_bazel_rules_nodejs_rollup_deps/node_modules/rollup-plugin-commonjs/src/utils.js:20:68

Target //src:bundle failed to build
Use --verbose_failures to see the command lines of failed build steps.
INFO: Elapsed time: 6.889s, Critical Path: 3.73s
INFO: 0 processes.
FAILED: Build did NOT complete successfully
The terminal process terminated with exit code: 1
```

Add `"@npm//@ng-bootstrap/ng-bootstrap",` to //src:bundle deps
```bazel
"@npm//@ng-bootstrap/ng-bootstrap",
```
```bash
bazel build //src:bundle
# SUCCESS
```

```bash
bazel build //src:prodapp
# SUCCESS
```

```bash
bazel run //src:deverserver
```

Browser ERROR:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
zone.min.js?v=1567992324291:1 Uncaught Error: Script error for "@ng-bootstrap/ng-bootstrap", needed by: @ng-bootstrap/ng-bootstrap/ng-bootstrap.ngfactory, project/src/app/app.component.ngfactory, project/src/app/app.module.ngfactory, project/src/app/app.module
http://requirejs.org/docs/errors.html#scripterror
    at makeError (bundle.min.js?v=1567992324291:169)
    at HTMLScriptElement.onScriptError (bundle.min.js?v=1567992324291:1739)
    at e.invokeTask (zone.min.js?v=1567992324291:1)
    at t.runTask (zone.min.js?v=1567992324291:1)
    at t.invokeTask [as invoke] (zone.min.js?v=1567992324291:1)
    at _ (zone.min.js?v=1567992324291:1)
    at HTMLScriptElement.m (zone.min.js?v=1567992324291:1)
```
