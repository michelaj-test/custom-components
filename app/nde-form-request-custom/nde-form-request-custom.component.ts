//this component remove the chooseType field and hide citationType for the Purchase Form.
// For the ILL form, reset the library list, make it mandatory, and reorder it.
import { Component, Input} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'custom-nde-form-request-custom',
  standalone: true,
  imports: [],
  template: ''
})
export class NdeFormRequestCustomComponent {
  private observer?: MutationObserver;
  private citationObserver?: MutationObserver;
  private citationTimeout?: any;
  constructor(private translate: TranslateService) {}
  @Input() hostComponent!: any;

  ngAfterViewInit() {
    const field = this.hostComponent?.field;
    const form: FormGroup = this.hostComponent?.form;
    const key = field?.key;

    if (!field || !form || !key) return;
    if (!['owner', 'citationType', 'physicalChooseType'].includes(key)) return;

    switch (key) {
      case 'citationType':
        this.removeCitationTypeField();
        break;

      case 'physicalChooseType':
        // nascondi a livello dati (più robusto del DOM)
        field.hide = true;
        break;

      case 'owner':
        // 🔸 placeholder: serve null, non stringa vuota
        field.defaultValue = null;
        this.setupOwnerField(field, form);       
        // ✅ FIX: aggiorna quando cambia lingua
        this.translate.onLangChange.subscribe(() => {
          setTimeout(() => this.addOwnerHelpText(), 50);
        });
        this.addOwnerHelpText();   // ✅ per aggiungere il testo sotto il campo
        break;
    }
  }

  /** 🔹 Rimuove completamente il blocco citationType via DOM (incluso divider) */
  private removeCitationTypeField() {
    const removeCitationType = () => {
      const citationField = document.querySelector(
        'formly-field[data-qa="almaPurchaseRequest.citationType"]'
      );
      if (!citationField) return;

      const formlyGroup = citationField.closest('formly-group.radio-buttons-wrapper');
      const topLevelField = formlyGroup?.closest('formly-field');

      if (topLevelField) (topLevelField as HTMLElement).remove();
      else if (formlyGroup) (formlyGroup as HTMLElement).remove();
      else (citationField as HTMLElement).remove();

      this.safeDisconnect(this.citationObserver);
      this.citationObserver = undefined;
    };

    // Esegui subito (per i casi già presenti nel DOM)
    removeCitationType();

    // Avvia l’osservatore (debounce) per gestire eventuali rigenerazioni
    if (!this.citationObserver) {
      this.citationObserver = new MutationObserver(() => {
        clearTimeout(this.citationTimeout);
        this.citationTimeout = setTimeout(removeCitationType, 50);
      });
      this.citationObserver.observe(document.body, { childList: true, subtree: true });
    }
  }

  /** 🔹 Owner: nessuna selezione iniziale (placeholder) + reset coerente */
  private setupOwnerField(field: any, form: FormGroup) {
    const control = field.formControl;
    const key = field.key || 'owner';
    const model = this.hostComponent?.model || {};

    // Validator (se vuoi che sia obbligatorio)
    if (control) {
      control.setValidators(Validators.required);
      control.updateValueAndValidity({ emitEvent: false });
    }

    // 🔸 funzione che porta TUTTO allo stato "placeholder"
    const clearToPlaceholder = () => {
      if (control) {
        control.setValue(null, { emitEvent: true }); // null = placeholder visibile
        control.updateValueAndValidity({ emitEvent: false });
      }
      // Azzeriamo anche eventuali chiavi lette in submit: a null (mai stringhe)
      this.nullifyModelKeys(model, [key, 'owner', 'pickupLocation', 'preferredPickupLocation', 'preferredLocalPickupLocation']);
    };

    // 1) Subito
    clearToPlaceholder();
    // 2) Dopo un micro-tick, per "vincere" eventuali patch iniziali di Formly/Primo
    setTimeout(clearToPlaceholder, 0);

    // 🔸 Reset: torna sempre al placeholder (null)
    const originalReset = form.reset.bind(form);
    form.reset = (...args: any[]) => {
      originalReset(...args);
      clearToPlaceholder();
    };

    // 🔸 Ordina la lista quando si apre il pannello (overlay)
    this.setupLibraryListObserver();
  }
  //funzione per aggiungere scritta sotto campo owner
  private addOwnerHelpText() {
   const insertText = () => {

    const fieldEl = document.querySelector('formly-field[data-qa="almaResourceSharing.owner"]');
    if (!fieldEl) return;

    const matField = fieldEl.querySelector('mat-form-field');
    if (!matField) return;

    const subscript = matField.querySelector('.mat-mdc-form-field-subscript-wrapper');
    if (!subscript) return;

    let help = subscript.querySelector('.custom-owner-help') as HTMLElement;

    if (!help) {
      help = document.createElement('div');
      help.className = 'custom-owner-help';
      subscript.appendChild(help);
    }

    // ✅ label Alma
    help.innerText = this.translate.instant('ndeResourceSharing.owner.notice');
   };

   insertText();
  }

  /** 🔹 Imposta a null le chiavi del model (stringhe, numeri o oggetti con .value) */
  private nullifyModelKeys(model: any, keys: string[]) {
    keys.forEach(k => {
      if (!k) return;
      if (!(k in model)) return;
      const cur = model[k];
      if (cur && typeof cur === 'object' && 'value' in cur) {
        // pattern oggetto { value: ... } → settiamo value a null
        model[k] = { ...cur, value: null };
      } else {
        // stringhe/numeri/altro → null
        model[k] = null;
      }
    });
  }

  /** 🔹 Riordina la lista delle biblioteche quando viene aperto il select */
  private setupLibraryListObserver() {
    if (this.observer) return; // evita doppia istanza

    this.observer = new MutationObserver(() => {
      const panel = document.querySelector('.mat-mdc-select-panel');
      if (!panel || panel.getAttribute('data-filtered')) return;
      this.sortLibraryList(panel);
      panel.setAttribute('data-filtered', 'true');
    });

    // stile semplice e robusto (come nel purchase): osserva il body
    this.observer.observe(document.body, { childList: true, subtree: true });
  }

  /** 🔹 Ordina alfabeticamente le opzioni di un mat-select */
  private sortLibraryList(panel: Element) {
    const options = Array.from(panel.querySelectorAll('mat-option'));
    if (!options.length) return;

    const validOptions = options.filter(opt => {
      const text = opt.querySelector('.mdc-list-item__primary-text')?.textContent?.trim() || '';
      return text.length > 0;
    });

    validOptions.sort((a, b) => {
      const nameA = a.querySelector('.mdc-list-item__primary-text')?.textContent?.trim() || '';
      const nameB = b.querySelector('.mdc-list-item__primary-text')?.textContent?.trim() || '';
      return nameA.localeCompare(nameB);
    });

    panel.innerHTML = '';
    validOptions.forEach(opt => panel.appendChild(opt));
  }

  /** 🔹 Disconnessione sicura (evita errori se l’observer è undefined/null) */
  private safeDisconnect(obs?: MutationObserver) {
    try { if (obs && typeof obs.disconnect === 'function') obs.disconnect(); } catch { /* no-op */ }
  }

  /** 🔹 Cleanup finale */
  ngOnDestroy() {
    this.safeDisconnect(this.observer);
    this.safeDisconnect(this.citationObserver);
    this.observer = undefined;
    this.citationObserver = undefined;
  }
}
