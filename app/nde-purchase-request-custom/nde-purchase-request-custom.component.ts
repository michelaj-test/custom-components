//this component hide some library from the list of library field in purchase form
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'custom-nde-purchase-request-custom',
  standalone: true,
  imports: [CommonModule],
  template: ''
})
export class NdePurchaseRequestCustomComponent {
  private observer!: MutationObserver;
  @Input() hostComponent!: any;

  ngAfterViewInit() {
    const formType = this.hostComponent?.formType ?? '';
    if(formType.includes("PurchaseRequest")) {
      this.setupObserver();
     }
  }
  
  private setupObserver() {
    this.observer = new MutationObserver((mutations) => {
      const librariesPanel = document.querySelector('.mat-mdc-select-panel');
      if (!librariesPanel) {
        return; 
      }
      
      const isPanelFiltered = librariesPanel.getAttribute('data-filtered');
      if (!isPanelFiltered) {
        this.filterAndSortLibraryList(librariesPanel);
        librariesPanel.setAttribute('data-filtered', 'true');
      }
    });
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  private filterAndSortLibraryList(panel: Element) {
    const options = panel.querySelectorAll('mat-option');
    if (options.length === 0) {
      console.warn('ATTENZIONE: Nessun elemento "mat-option" trovato. Il selettore potrebbe essere obsoleto o la lista delle biblioteche è vuota.');
      return;
    }

    const librariesToRemove = [
      'Biblioteca Digitale', 'Biblioteca di Psicologia', 'APICE',
      'Direzione Servizio Bibliotecario d\'Ateneo - Archivio Tesi', 
      'Biblioteca di Anestesiologia e Terapia intensiva - Dipartimento di Fisiopatologia medico-chirurgica e dei trapianti',
      'Biblioteca di Scienze cardiovascolari - Dipartimento di Scienze cliniche e di comunità',
      'Biblioteca di Scienze ortopediche traumatologiche reumatologiche e riabilitative, c/o ASST Gaetano Pini-CTO',
      'Biblioteca di Sanità pubblica e Discipline infermieristiche',
      'Biblioteca di Pediatria e neonatologia - Dipartimento di Scienze cliniche e di comunità',
      'Biblioteca di Psicologia - Dipartimento di Fisiopatologia medico-chirurgica e dei trapianti',
      'Biblioteca del Centro linguistico d\'Ateneo - SLAM - Palazzo Feltrinelli',
      'Biblioteca di Scienze biomediche e cliniche "Luigi Sacco"',
      'Direzione Servizio Bibliotecario d\'Ateneo',
      'Biblioteca di Medicina legale - Dipartimento di Scienze biomediche per la salute',
      'Servizi interbibliotecari sede Festa del Perdono. Bibl. di Studi giuridici e umanistici',
      'Biblioteca Biomedica di Città Studi. Servizi interbibliotecari',
      'Biblioteca del Centro funzionale Raffaele Mattioli', '-', '--',
      'Servizi interbibliotecari - Medicina - Farmacia - Scienze Motorie',
      'Resource Sharing Library'
    ];
    
    const validOptions: Element[] = [];

    // Fase 1: Filtrare le opzioni e prepararle per l'ordinamento
    options.forEach(option => {
      const libraryNameElement = option.querySelector('.mdc-list-item__primary-text');
      if (!libraryNameElement) {
        console.warn('ATTENZIONE: Nessun elemento ".mdc-list-item__primary-text" trovato all\'interno di un "mat-option". Il selettore potrebbe essere obsoleto.');
        return;
      }
      
      const libraryName = libraryNameElement.textContent?.trim();

      if (libraryName && !librariesToRemove.includes(libraryName)) {
        validOptions.push(option);
      } else if (libraryName) {
        option.remove();
      }
    });

    if (validOptions.length === 0) {
      console.warn('ATTENZIONE: Nessuna opzione valida da ordinare dopo il filtraggio. Controlla che le librerie da rimuovere siano corrette o che la lista non sia già vuota.');
      return;
    }

    // Fase 2: Ordinare le opzioni
    validOptions.sort((a, b) => {
      const nameA = a.querySelector('.mdc-list-item__primary-text')?.textContent?.trim() || '';
      const nameB = b.querySelector('.mdc-list-item__primary-text')?.textContent?.trim() || '';
      return nameA.localeCompare(nameB);
    });

    // Aggiungi le opzioni ordinate al pannello
    validOptions.forEach(sortedOption => {
      panel.appendChild(sortedOption);
    });
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }
}