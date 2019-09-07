import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyLibService {

  constructor() { }

  getLibServiceMessage = (): string => {
     return 'hello from MyLibService';
  }
}
