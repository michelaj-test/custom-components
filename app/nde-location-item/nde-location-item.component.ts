// this component add the mewssagge unavailable and hide the label "in library-use only" in items of unavailable volume" 06/02/2026 */
import { Component, ElementRef, Input, Renderer2, DestroyRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { selectAvailabilityByHoldingId } from '../utils/fullDisplayRecordSelector';

@Component({
  selector: 'custom-nde-location-item',
  standalone: true,
  imports: [CommonModule],
  // Non rende markup proprio; non altera il layout della pagina.
  template: ''
})
export class NdeLocationItemComponent  {

  /**
   * 0 = normale (lascia com'è)
   * 1 = unavailable da store → nascondi solo la colonna destra, sinistra invariata
   * 2 = unavailable da testo (subLocationItem) → resa personalizzabile (default: sinistra "Non disponibile", destra nascosta)
   */
  @Input() statusMode: number = 0;

  /**
   * Testi configurabili.
   * NB: Per mode 1 (store) NON tocchiamo la sinistra: lasciamo left undefined e right '' (così la destra può essere svuotata se vuoi, ma comunque viene nascosta).
   */
  @Input() textsByMode: { [mode: number]: { left?: string; right?: string } } = {
    0: {},                 // lascia com'è
    1: { right: '' },      // store → sinistra invariata, destra può essere blank (comunque nascosta)
    2: { left: 'Non disponibile', right: '' } // subLocation → messaggio a sinistra e destra nascosta (default)
  };

  /** In questi mode, la colonna destra dell'header viene nascosta. */
  @Input() hideRightInModes: number[] = [1, 2];

  @Input() private hostComponent!: any;

  itemstate: any = {};

  private store = inject(Store);
  private destroyRef = inject(DestroyRef);

  private domObs?: MutationObserver;
  private retryTimer?: any;
  private patchDebounce?: any;

  constructor(private el: ElementRef<HTMLElement>, private r2: Renderer2) {
  }

  ngAfterViewInit(): void {
    this.itemstate = this.hostComponent?.item || {};
    const subLocationItem = (this.itemstate.secondarylocationname || '').toLowerCase();

    // 1) Pre-calcolo: candidato mode da subLocation (solo se NON prevale lo store)
    let candidateFromText: number | null = null;
    if (
      subLocationItem &&
      (subLocationItem.includes('non ') ||
       subLocationItem.includes('not ') ||
       subLocationItem.includes('unavailable'))
    ) {
      candidateFromText = 2;
    }

    // 2) Osserva store → se 'unavailable' PREVALE e imposta mode=1 (sinistra invariata, destra nascosta)
    const holdingId = this.itemstate.holdingrecordid;
    if (holdingId) {
      this.store.select(selectAvailabilityByHoldingId(holdingId))
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(status => {
          const s = (status || '').toLowerCase();
          if (s.includes('unavailable')) {
            // Precedenza allo store
            this.statusMode = 1;
            this.applyPatchSafe('store-unavailable');
          } else {
            // Store non unavailable → applica l'eventuale candidato da subLocation
            if (candidateFromText !== null) {
              this.statusMode = candidateFromText;
            } else {
              this.statusMode = 0;
            }
            this.applyPatchSafe('store-available-or-unknown');
          }
        });
    } else {
      // Nessuno store → usa solo la regola da subLocation
      this.statusMode = candidateFromText ?? 0;
      this.applyPatchSafe('init');
    }

    // Observer DOM locale con debounce
    this.attachDomObserver();
    // evita un giro inutile di observer
    this.applyPatchSafe('init-final');
  }

  ngOnDestroy(): void {
    this.domObs?.disconnect();
    if (this.retryTimer) clearTimeout(this.retryTimer);
    if (this.patchDebounce) clearTimeout(this.patchDebounce);
  }

  // ----------------- Observer locale -----------------
  private attachDomObserver() {
    const host = this.el.nativeElement;
    this.domObs = new MutationObserver(() => {
      if (this.patchDebounce) return;

      this.patchDebounce = setTimeout(() => {
        this.applyPatchSafe('mutation');
        this.patchDebounce = null;
      }, 50);
    });
    this.domObs.observe(host, { childList: true, subtree: true, characterData: false, attributes: false });
  }

  // ----------------- Patch applicata in contesto sicuro -----------------
  private applyPatchSafe(reason: string) {
    try {
      this.applyPatch(reason);
    } catch (e) {
      console.error('[PATCH] applyPatchSafe error', e);
    }
  }

  // ----------------- Logica di patch: SOLO i due <span> dell’header -----------------
  private applyPatch(_reason: string) {
    const me = this.el.nativeElement;

    // 1) Risaliamo al contenitore dell’item
    const itemRoot =
      (me.closest('nde-location-item') as HTMLElement)
      ?? (me.closest('mat-expansion-panel') as HTMLElement)
      ?? (me.parentElement as HTMLElement | null);

    if (!itemRoot) return;

    // 2) Troviamo i due span dell’header
    const spans = itemRoot.querySelectorAll(
      '.mat-expansion-panel-header .getit-items-brief-property span[ndetooltipifoverflow]'
    ) as NodeListOf<HTMLElement>;

    if (spans.length === 0) return;

    const cfg = this.textsByMode[this.statusMode] || {};
    const leftText  = cfg.left;
    const rightText = cfg.right;
    const hideRight = this.hideRightInModes.includes(this.statusMode);

    // Sinistra (spans[0]) → la modifichiamo SOLO se leftText è definito e non vuoto
    const leftSpan = spans[0];
    if (leftSpan && leftText !== undefined && leftText !== '') {
      this.setText(leftSpan, leftText);
    }

    // Destra (spans[1]) → nascondi/mostra + eventuale testo
    const rightSpan = spans[1] || null;
    if (rightSpan) {
      const rightBox = rightSpan.closest('.getit-items-brief-property') as HTMLElement | null;
      if (hideRight) {
        // NASCONDI (bugfix: non rimuovere subito lo stile)
        rightBox && this.r2.setStyle(rightBox, 'display', 'none');
        if (rightText !== undefined && rightText !== '') {
          this.setText(rightSpan, rightText);
        }
      } else {
        // MOSTRA
        rightBox && this.r2.removeStyle(rightBox, 'display');
        if (rightText !== undefined && rightText !== '') {
          this.setText(rightSpan, rightText);
        }
      }
    }
  }

  private setText(el: HTMLElement, text: string) {
    el.textContent = text;
  }

}