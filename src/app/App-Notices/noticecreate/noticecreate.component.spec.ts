import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticecreateComponent } from './noticecreate.component';

describe('NoticecreateComponent', () => {
  let component: NoticecreateComponent;
  let fixture: ComponentFixture<NoticecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NoticecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoticecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
