//this component hide purchase option for not found articles
import { Component, Input, inject, Renderer2 } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { selectFullDisplayRecord } from '../utils/fullDisplayRecordSelector';

@Component({
  selector: 'custom-nde-request-card-purchase',
  standalone: true,
  template: ''
})
export class NdeRequestCardPurchaseComponent {
  @Input() hostComponent!: any;
  record$!: Observable<any>;
  private recordSub?: Subscription;
  private store = inject(Store);
  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    if (this.hostComponent.request.type !== 'AlmaPurchaseRequest') return;
    this.record$ = this.store.select(selectFullDisplayRecord);
    this.recordSub = this.record$.subscribe(record => {
    if (!record?.pnx?.display?.type) return;

    const type = record.pnx.display.type[0];
    if (type === 'article') {
      console.log('Record type = article → nascondo request card');
      const el = document.querySelector('[data-qa="AlmaPurchaseRequest"]');
      if (el) {
        console.log('Card già presente → nascondo subito');
        this.renderer.setStyle(el, 'display', 'none');
      }
    } else {
      // se non è article → mostro la card
      document.querySelectorAll('[data-qa="AlmaPurchaseRequest"]').forEach(el => {
        this.renderer.removeStyle(el, 'display');
      });
    }
  });
}

  ngOnDestroy() {
    this.recordSub?.unsubscribe();
  }
}
