import { createFeatureSelector, createSelector} from '@ngrx/store';

// per ora "any"
interface FullDisplayState {
  selectedRecordId: string | null;
  getItLocations?: {
    locations?: { [key: string]: any };
    // Aggiungi questa riga:
    allExpanded?: boolean;
  };
}
 
interface SearchState {
  entities: { [key: string]: any };
}

// Tipizzazione minimale, senza @ngrx/router-store
interface CustomRouterState {
  state?: {
    root?: {
      queryParams?: {
        [key: string]: any;
      };
    };
  };  
}

const selectFullDisplay = createFeatureSelector<FullDisplayState>('full-display');
const selectSearchState = createFeatureSelector<SearchState>('Search');
const selectFullDisplayRecordId = createSelector(
  selectFullDisplay,
  (fullDisplay: FullDisplayState) => fullDisplay?.selectedRecordId ?? null
);
export const selectFullDisplayRecord = createSelector(
  selectFullDisplayRecordId,
  selectSearchState,
  (recordId: string | null, searchState: SearchState) => recordId ? searchState.entities[recordId] : null
);


// Selettore per URL
export const selectRouterUrl = (state: any): string =>
  state?.router?.state?.url ?? '';


export const selectQueryParams = (state: any) =>
  state.router?.state?.root?.queryParams ?? {};

export const selectIsAllExpanded = createSelector(
  selectFullDisplay,
  (state: any) => {
    // Esaminiamo getItLocations che abbiamo visto nell'immagine di Redux
    // Se allExpanded è sempre false, cerchiamo una chiave specifica per gli item
    return state.getItLocations?.['allItemsExpanded'] ?? 
           state.getItLocations?.['allExpanded'] ?? 
           false;
  }
);

// 1. Puntiamo alla feature Delivery
export const selectDeliveryState = createFeatureSelector<any>('Delivery');

// 2. Puntiamo alle entities del Delivery
export const selectDeliveryEntities = createSelector(
  selectDeliveryState,
  (state) => state?.entities || {}
);

export const selectAvailabilityByHoldingId = (holdingIdFromUI: any) => createSelector(
  selectFullDisplayRecordId,
  selectDeliveryEntities,
  (recordId, entities) => {
    if (!recordId || !entities[recordId] || !holdingIdFromUI) return null;

    const holdings = entities[recordId]?.delivery?.holding || [];
    
    // Convertiamo tutto in stringa per un confronto sicuro
    const searchId = String(holdingIdFromUI);

    const matchingHolding = holdings.find((h: any) => 
      String(h.holdId) === searchId || searchId.includes(String(h.holdId))
    );

    return matchingHolding ? matchingHolding.availabilityStatus : null;
  }
);