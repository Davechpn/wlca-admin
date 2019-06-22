import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpenditurecreateComponent } from './expenditurecreate.component';

describe('ExpenditurecreateComponent', () => {
  let component: ExpenditurecreateComponent;
  let fixture: ComponentFixture<ExpenditurecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpenditurecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpenditurecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
