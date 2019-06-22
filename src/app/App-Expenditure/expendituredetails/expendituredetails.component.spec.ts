import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpendituredetailsComponent } from './expendituredetails.component';

describe('ExpendituredetailsComponent', () => {
  let component: ExpendituredetailsComponent;
  let fixture: ComponentFixture<ExpendituredetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpendituredetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpendituredetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
