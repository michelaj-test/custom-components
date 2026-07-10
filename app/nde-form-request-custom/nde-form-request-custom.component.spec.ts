import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeFormRequestCustomComponent } from './nde-form-request-custom.component';

describe('NdeFormRequestCustomComponent', () => {
  let component: NdeFormRequestCustomComponent;
  let fixture: ComponentFixture<NdeFormRequestCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeFormRequestCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeFormRequestCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
