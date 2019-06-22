import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { wordComponent } from './word.component';

describe('wordComponent', () => {
  let component: wordComponent;
  let fixture: ComponentFixture<wordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ wordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(wordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
