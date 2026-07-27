// This component detects when request buttons are NOT present on the full record display when users are logged in and 
// ensures that all location accordions are expanded so that the buttons are visible. 
import { Component, inject, Input, DestroyRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectServiceInfo, selectIsLoggedIn } from '../utils/fullDisplayRecordSelector';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'custom-nde-location-expand',
  standalone: true,
  imports: [],
  templateUrl: './nde-location-expand.component.html',
  styleUrl: './nde-location-expand.component.scss'
})
export class NdeLocationExpandComponent {
private destroyRef = inject(DestroyRef);
  @Input() private hostComponent!: any;
  private store = inject(Store);

  

  // If item-level requests are available, when logged-in, shows help text in the Request section of the full record display. 
  // Requires items to be visible (not collapsed under holdings) first.

  ngOnInit(): void {
    combineLatest([
      this.store.select(selectIsLoggedIn),
      this.store.select(selectServiceInfo)
    ])
      .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(([isLoggedIn, serviceInfo]) => {

          if (
            Array.isArray(serviceInfo) &&
            isLoggedIn &&
            serviceInfo.length === 0
          ) {
            this.hostComponent.expanded = true;
          }

      });
  }
 
}
