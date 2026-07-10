//this component add the list of related title under the location section and hide the library locations for multi volume works
//aggiunge la lista delle opere in più volumi solo a queste condizioni: diplay.type dell'opera è "book", ha non nullo il campo "OpSup" e nei titoli correlati c'è "contains"
import { Component, Input, NgZone, ChangeDetectorRef, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { combineLatest, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { selectFullDisplayRecord, selectQueryParams } from '../utils/fullDisplayRecordSelector';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'nde-getit-multi-volume',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './nde-getit-multi-volume.component.html',
  styleUrl: './nde-getit-multi-volume.component.scss'
})
export class NdeGetitMultiVolumeComponent {
  @Input() hostComponent!: any;

  displaySection1: string[][] = [];
  displaySection2: string[][] = [];
  currentLang: 'it' | 'en' = 'it';
  showAll = false;

  private destroy$ = new Subject<void>();
  hideLocationsList = false;

  // >>> NEW: manteniamo un riferimento a <nde-get-it>
  private ndeGetIt?: HTMLElement;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private store: Store,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private el: ElementRef<HTMLElement>,      // <<< NEW
    private renderer: Renderer2               // <<< NEW
  ) {}

  toggleShowAll(): void {
    this.showAll = !this.showAll;
  }

  ngOnInit(): void {
    if (!this.hostComponent?.holdings$) return;

    // Prendiamo il parent <nde-get-it> una volta sola quando il componente parte
    this.ndeGetIt = this.el.nativeElement.closest('nde-get-it') as HTMLElement | null || undefined;

    combineLatest({
      record: this.store.select(selectFullDisplayRecord),
      queryParams: this.store.select(selectQueryParams),
      holdings: this.hostComponent.holdings$
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe(({ record, queryParams, holdings }) => {

      // reset stato e UI del componente
      this.resetSections();
      this.currentLang = (this.translate.currentLang as 'it' | 'en') || 'it';

      // --- CONDIZIONI ESISTENTI ---
      if (!record?.pnx?.display?.type?.includes('book')) {
        this.setHideLocations(false);
        this.cdr.detectChanges();
        return;
      }

      const holdingList = Object.values(holdings || {}).flat();
      const hasOpSup = holdingList.some((h: any) => h?.subLocationCode === 'op_sup'); // <-- verifica se serve 'op-sup'
      if (!hasOpSup) {
        this.setHideLocations(false);
        this.cdr.detectChanges();
        return;
      }

      const relations: string[] = record?.pnx?.display?.relation || [];

      // 1) Valutazione pulita della condizione: basta che ce ne sia uno con 'contains'
      const hasContains = relations.some((relation: string) => {
        const parts = relation.split('$$');
        return parts[1]?.includes('contains');
      });

      // Nascondi locations solo se: hasOpSup && hasContains
      this.setHideLocations(hasOpSup && hasContains);

      // Se non c'è 'contains', non costruire link e termina
      if (!hasContains) {
        this.cdr.detectChanges();
        return;
      }

      // 2) Costruisci i parametri solo ora (serve davvero solo se hasContains)
      const essentialParams = new URLSearchParams();
      essentialParams.set('vid', queryParams?.['vid'] || '');
      essentialParams.set('search_scope', queryParams?.['search_scope'] || 'MyInst_and_CI');
      essentialParams.set('tab', queryParams?.['tab'] || 'Everything');
      essentialParams.set('context', queryParams?.['context'] || 'L');
      essentialParams.set('lang', this.translate.currentLang || 'it');

      // 3) Costruisci i link solo per le relations che contengono 'contains'
      relations.forEach((relation: string, index: number) => {
        const parts = relation.split('$$');
        if (!parts[1]?.includes('contains')) return;

        const label = parts[2]?.slice(1);
        const docid = `alma${parts[3]?.slice(1)}`;
        // Usa '&' (non '&amp;') perché qui non sei in HTML
        const link = `/nde/fulldisplay?docid=${docid}&${essentialParams.toString()}`;

        (index < 11 ? this.displaySection1 : this.displaySection2).push([label, link]);
      });

      // Forza Angular a renderizzare i nuovi link
      this.cdr.detectChanges();
    });
  }

  // >>> NEW: centralizziamo la logica che (1) aggiorna la variabile e
  // (2) aggiunge/rimuove la classe CSS sul parent <nde-get-it>
  private setHideLocations(active: boolean): void {
    if (this.hideLocationsList === active) return; // evita operazioni inutili

    this.hideLocationsList = active;

    if (!this.ndeGetIt) {
      this.ndeGetIt = this.el.nativeElement.closest('nde-get-it') as HTMLElement | null || undefined;
    }
    if (!this.ndeGetIt) return;

    if (active) {
      this.renderer.addClass(this.ndeGetIt, 'hide-locations');
    } else {
      this.renderer.removeClass(this.ndeGetIt, 'hide-locations');
    }
  }

  navigateTo(link: string, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    this.zone.run(() => {
      this.router.navigateByUrl(link).then(success => {
        if (!success) {
          window.history.pushState({}, '', link);
          window.dispatchEvent(new PopStateEvent('popstate'));
        }
      });
    });
  }

  private resetSections(): void {
    this.displaySection1 = [];
    this.displaySection2 = [];
  }

  get labelMulti(): string {
    return this.currentLang === 'en'
      ? 'Multi-volume work, select a volume'
      : 'Opera in più volumi, scegliere un volume';
  }

  ngOnDestroy(): void {
    // Ripristina stato UI quando il componente viene smontato
    this.setHideLocations(false);
    this.destroy$.next();
    this.destroy$.complete();
  }
}
