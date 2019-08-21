import { Component } from '@angular/core';
import { MyLibService } from '../../../my-lib/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'my-app';

  constructor(private readonly _myLibService: MyLibService) {}

  messageFromLib(): string {
    return this._myLibService.libMessage();
  }

}
