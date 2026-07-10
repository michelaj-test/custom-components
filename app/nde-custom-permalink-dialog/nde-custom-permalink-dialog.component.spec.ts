import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeCustomPermalinkDialogComponent } from './nde-custom-permalink-dialog.component';

describe('NdeCustomPermalinkDialogComponent', () => {
  let component: NdeCustomPermalinkDialogComponent;
  let fixture: ComponentFixture<NdeCustomPermalinkDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeCustomPermalinkDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeCustomPermalinkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
