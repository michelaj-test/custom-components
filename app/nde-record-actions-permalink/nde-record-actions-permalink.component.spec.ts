import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeRecordActionsPermalinkComponent } from './nde-record-actions-permalink.component';

describe('NdeRecordActionsPermalinkComponent', () => {
  let component: NdeRecordActionsPermalinkComponent;
  let fixture: ComponentFixture<NdeRecordActionsPermalinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeRecordActionsPermalinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeRecordActionsPermalinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
