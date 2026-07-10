import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeGetitMultiVolumeComponent } from './nde-getit-multi-volume.component';

describe('NdeGetitMultiVolumeComponent', () => {
  let component: NdeGetitMultiVolumeComponent;
  let fixture: ComponentFixture<NdeGetitMultiVolumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeGetitMultiVolumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeGetitMultiVolumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
