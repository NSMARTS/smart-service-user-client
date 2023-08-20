import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyStatusComponent } from './my-status.component';

describe('MyStatusComponent', () => {
  let component: MyStatusComponent;
  let fixture: ComponentFixture<MyStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MyStatusComponent]
    });
    fixture = TestBed.createComponent(MyStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
