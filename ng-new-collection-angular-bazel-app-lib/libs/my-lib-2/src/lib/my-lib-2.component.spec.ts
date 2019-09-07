import { TestBed, async } from '@angular/core/testing';
import { MyLibComponent } from './my-lib-2.component';

describe('MyLibComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        MyLibComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(MyLibComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
