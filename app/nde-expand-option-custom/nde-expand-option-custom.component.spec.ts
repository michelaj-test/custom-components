import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeExpandOptionCustomComponent } from './nde-expand-option-custom.component';

describe('NdeExpandOptionCustomComponent', () => {
  let component: NdeExpandOptionCustomComponent;
  let fixture: ComponentFixture<NdeExpandOptionCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeExpandOptionCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeExpandOptionCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
