//this component add permalink button in result records buttons
import { Component, Input, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { Subject, firstValueFrom, Observable  } from 'rxjs';
import { distinctUntilChanged, map, takeUntil } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { NdeCustomPermalinkDialogComponent } from '../nde-custom-permalink-dialog/nde-custom-permalink-dialog.component';
import { selectRouterUrl, selectQueryParams } from '../utils/fullDisplayRecordSelector';
import { MatTooltipModule } from '@angular/material/tooltip';

// Suggerito: definire un'interfaccia minima anziché `any`

interface PermalinkService {
  shortPermalink?: (item: { pnx: unknown; context: unknown }) => Observable<string>;
  // opzionale, non documentato ufficialmente
  shortPermalinkFromParams?: (args: Record<string, unknown>) => Observable<string>;
}

interface HostComponentLike {
  searchResult?: {
    pnx?: unknown;
    context?: unknown;
  };
  recordActionsService?: {
    printAction?: {
      permalinkService?: PermalinkService;
    };
  };
}


@Component({
  selector: 'custom-nde-record-actions-permalink',
  standalone: true,
  imports: [MatIconModule, CommonModule, MatTooltipModule], // Rimuovi se non usati nel template
  templateUrl: './nde-record-actions-permalink.component.html',
  styleUrl: './nde-record-actions-permalink.component.scss'
})
export class NdeRecordActionsPermalinkComponent {

  @Input() hostComponent!: HostComponentLike;
  @Input() tooltip: string = 'Permalink';
  
  private readonly store = inject(Store);
  private readonly dialog = inject(MatDialog);
  private cd = inject(ChangeDetectorRef);

  private destroy$ = new Subject<void>();

  permalink = '';
  docid = '';
  
// Seleziona direttamente il docid e evita switchMap.
  private readonly docid$ = this.store.select(selectQueryParams).pipe(
    map((params: any) => params['docid'] ?? ''),
    distinctUntilChanged()
  );

  readonly routerUrl$ = this.store.select(selectRouterUrl);

  ngOnInit() {
    
    this.waitForRecordContext();
    this.docid$
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: newDocid => {
          if (newDocid && newDocid !== this.docid) {
            this.docid = newDocid;
            this.permalink = ''; // reset per rigenerare
          }
        },
        error: (err) => {
          // sostituisci con un logger se disponibile
          console.warn('[Permalink] Errore nel flusso docid.');
        }
      });

  }

  
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  async openPermalink(): Promise<void> {
    if (!this.permalink) {
      const short = await this.getShortPermalinkFromService();
      if (short && this.isValidUrl(short)) {
        this.permalink = short;
      }
    }

    this.dialog.open(NdeCustomPermalinkDialogComponent, {
      width: '560px',
      autoFocus: false,
      data: { permalink: this.permalink }
    });
  }

  //check per far comparire subito il bottone
  private waitForRecordContext() {
   const interval = setInterval(() => {
    // Se ora ho un record completo (pnx + context)
    if (this.resolveDocFromHost()) {
      clearInterval(interval);

      // Forza Angular a rinfrescare il componente
      this.cd.detectChanges();
    }
   }, 120); // 120 ms = leggerissimo, quasi zero impatto
  }


  /**
   * Recupera il Doc da hostComponent (mmsRecord o itemResult)
   */
  private resolveDocFromHost(): { pnx: unknown; context: unknown } | undefined {
    const c = this.hostComponent?.searchResult;
    if (!c) return undefined;
    const hasPnx = typeof c.pnx !== 'undefined';
    const hasContext = typeof c.context !== 'undefined';
    return hasPnx && hasContext ? { pnx: c.pnx!, context: c.context! } : undefined;
  }

  
  private async getShortPermalinkFromService(): Promise<string | undefined> {
    try {
      const ps = await this.waitForPermalinkService();

      const item = this.resolveDocFromHost();
      if (item) {
        const url = await firstValueFrom(ps.shortPermalink!(item));
        return url;
      }
    } catch (e) {
      console.warn('[Permalink] errore service');
    }

    return undefined;
  }
  //per non far comparire il bottone nella header del menù a scomparsa per smartphone:
  isRecordContext(): boolean {
    // è "record actions" solo se c'è un doc completo
    return !!this.resolveDocFromHost();
  }

  private isValidUrl(url: string): boolean {
    try { new URL(url); return true; } catch { return false; }
  }
  

  private waitForPermalinkService(): Promise<PermalinkService> {
   return new Promise((resolve) => {
    const interval = setInterval(() => {
      const ps = this.hostComponent?.recordActionsService?.printAction?.permalinkService;

      if (ps && typeof ps.shortPermalink === 'function') {
        clearInterval(interval);
        resolve(ps);
      }
    }, 120);
   });
  }
}