## Ng-Bootstrap
1. Create worksapce
```bash
ng new --createApplication=false
# called ng-bootsrap
```

2. Add an app
```bash
ng g app my-app
```

3. Add a lib
```bash
ng g lib my-lib
```

4. Add ng-bootstrap
```bash
yarn add @ng-bootstrap/ng-bootstrap
# or
# npm install --save @ng-bootstrap/ng-bootstrap
```

5. Add ng-alert to app.component.html
```html
<ngb-alert [dismissible]="false">
  <strong>Warning!</strong> Better check yourself, you're not looking too good.
</ngb-alert>
```

6. Add NgbModule to app.module
```ts
import {NgbAlertModule} from '@ng-bootstrap/ng-bootstrap';
// ...
imports: [
  //...
  NgbAlertModule,
  //...
]
```

7. Note if you want Bootstrap stylings
Option 1: Add boostrap.css as stylesheet to index.html
```html
<link rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" />
```

Option 2: Add vid npm and add bootstrap.scss to styles.scss
```bash
yarn add bootstrap
```
```scss
@import '~bootstrap/scss/bootstrap';
```
