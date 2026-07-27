import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeLocationExpandComponent } from './nde-location-expand.component';

describe('NdeLocationExpandComponent', () => {
  let component: NdeLocationExpandComponent;
  let fixture: ComponentFixture<NdeLocationExpandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeLocationExpandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeLocationExpandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
