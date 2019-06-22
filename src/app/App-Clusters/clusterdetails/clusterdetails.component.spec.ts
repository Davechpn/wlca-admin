import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterdetailsComponent } from './clusterdetails.component';

describe('ClusterdetailsComponent', () => {
  let component: ClusterdetailsComponent;
  let fixture: ComponentFixture<ClusterdetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
