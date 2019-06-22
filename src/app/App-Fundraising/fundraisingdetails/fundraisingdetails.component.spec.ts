import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FundraisingdetailsComponent } from './fundraisingdetails.component';

describe('FundraisingdetailsComponent', () => {
  let component: FundraisingdetailsComponent;
  let fixture: ComponentFixture<FundraisingdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FundraisingdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FundraisingdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
