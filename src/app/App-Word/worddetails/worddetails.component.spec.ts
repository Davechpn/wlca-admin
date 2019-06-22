import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { worddetailsComponent } from './worddetails.component';

describe('worddetailsComponent', () => {
  let component: worddetailsComponent;
  let fixture: ComponentFixture<worddetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ worddetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(worddetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
