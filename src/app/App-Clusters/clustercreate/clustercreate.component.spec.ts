import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClustercreateComponent } from './clustercreate.component';

describe('ClustercreateComponent', () => {
  let component: ClustercreateComponent;
  let fixture: ComponentFixture<ClustercreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClustercreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClustercreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
