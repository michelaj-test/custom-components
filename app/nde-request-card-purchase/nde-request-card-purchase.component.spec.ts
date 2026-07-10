import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeRequestCardPurchaseComponent } from './nde-request-card-purchase.component';

describe('NdeRequestCardPurchaseComponent', () => {
  let component: NdeRequestCardPurchaseComponent;
  let fixture: ComponentFixture<NdeRequestCardPurchaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeRequestCardPurchaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeRequestCardPurchaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
