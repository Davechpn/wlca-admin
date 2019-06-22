import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptaddComponent } from './receiptadd.component';

describe('ReceiptaddComponent', () => {
  let component: ReceiptaddComponent;
  let fixture: ComponentFixture<ReceiptaddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReceiptaddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
