import { Component } from '@angular/core';

import { MyLibService } from '../../../../libs/my-lib/my-lib.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ng-new-collection-angular-bazel-app-lib';

  constructor(private readonly _myLibService: MyLibService) {

  }

  getTitle = (): string => {
    return this.title;
  }

  getLibServiceMsg(): string {
    return this._myLibService.getLibServiceMessage();
  }
}
