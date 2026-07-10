import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeLocationItemComponent } from './nde-location-item.component';

describe('NdeLocationItemComponent', () => {
  let component: NdeLocationItemComponent;
  let fixture: ComponentFixture<NdeLocationItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeLocationItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeLocationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
