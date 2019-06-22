import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypledgeComponent } from './paypledge.component';

describe('PaypledgeComponent', () => {
  let component: PaypledgeComponent;
  let fixture: ComponentFixture<PaypledgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypledgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypledgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
