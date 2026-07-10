import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdePurchaseRequestCustomComponent } from './nde-purchase-request-custom.component';

describe('NdePurchaseRequestCustomComponent', () => {
  let component: NdePurchaseRequestCustomComponent;
  let fixture: ComponentFixture<NdePurchaseRequestCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdePurchaseRequestCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdePurchaseRequestCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
