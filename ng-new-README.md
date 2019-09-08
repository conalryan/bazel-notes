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

main.ts
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

dist
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