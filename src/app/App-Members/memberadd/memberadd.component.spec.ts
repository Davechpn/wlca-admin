import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberaddComponent } from './memberadd.component';

describe('MemberaddComponent', () => {
  let component: MemberaddComponent;
  let fixture: ComponentFixture<MemberaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
