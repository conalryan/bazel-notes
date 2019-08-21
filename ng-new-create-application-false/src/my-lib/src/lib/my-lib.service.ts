import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyLibService {

  constructor() { }

  libMessage(): string {
    return 'hello from my lib service';
  }
}
