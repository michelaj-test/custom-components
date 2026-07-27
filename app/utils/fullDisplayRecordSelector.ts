import { createFeatureSelector, createSelector} from '@ngrx/store';

// per ora "any"
interface FullDisplayState {
  selectedRecordId: string | null;
  getItLocations?: {
    locations?: { [key: string]: any };
    allExpanded?: boolean;
  };
}
 
interface SearchState {
  entities: { [key: string]: any };
}


const selectFullDisplay = createFeatureSelector<FullDisplayState>('full-display');
const selectSearchState = createFeatureSelector<SearchState>('Search');
const selectFullDisplayRecordId = createSelector(
  selectFullDisplay,
  (fullDisplay: FullDisplayState) => fullDisplay?.selectedRecordId ?? null
);

//nde-card-purchase-component e nde-multi-volume
export const selectFullDisplayRecord = createSelector(
  selectFullDisplayRecordId,
  selectSearchState,
  (recordId: string | null, searchState: SearchState) => recordId ? searchState.entities[recordId] : null
);
//per espandere la location quando non ci sono richieste nella sezione getit (nde-request-services)
export const selectServiceInfo = createSelector(
  selectFullDisplay,
  (state: any) => state?.serviceInfo
);
export const selectUserState = createFeatureSelector<any>('user');

export const selectIsLoggedIn = createSelector(
  selectUserState,
  (state) => state?.isLoggedIn ?? false
);


// Selettore per URL (nde-record-action-permalink)
export const selectRouterUrl = (state: any): string =>
  state?.router?.state?.url ?? '';


export const selectQueryParams = (state: any) =>
  state.router?.state?.root?.queryParams ?? {};


// 1. Puntiamo alla feature Delivery (per nde-location-item)
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
