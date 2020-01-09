# Ng Bootstrp with Bazel

I'm getting a runtime error in the browser:
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

I have tried:
- [angular-bazel-example fork](https://github.com/conalryan/angular-bazel-example/blob/ng-bootstrap/ngbREADME.md)
- [ng new ng-bootstrap-bazel](https://github.com/conalryan/ng-bootstrap-bazel/blob/feature/ng-bootstrap/README.md)

I'm assuming I'm missing some configuration?

https://stackoverflow.com/questions/57847116/how-to-fix-browser-uncaught-error-script-error-for-ng-bootstrap-ng-bootstrap
