import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingcreateComponent } from './fundraisingcreate.component';

describe('FundraisingcreateComponent', () => {
  let component: FundraisingcreateComponent;
  let fixture: ComponentFixture<FundraisingcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraisingcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraisingcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
