import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { wordcreateComponent } from './wordcreate.component';

describe('wordcreateComponent', () => {
  let component: wordcreateComponent;
  let fixture: ComponentFixture<wordcreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ wordcreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(wordcreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
