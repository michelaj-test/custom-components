import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NdeMainMenuDialogCustomComponent } from './nde-main-menu-dialog-custom.component';

describe('NdeMainMenuDialogCustomComponent', () => {
  let component: NdeMainMenuDialogCustomComponent;
  let fixture: ComponentFixture<NdeMainMenuDialogCustomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NdeMainMenuDialogCustomComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NdeMainMenuDialogCustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
