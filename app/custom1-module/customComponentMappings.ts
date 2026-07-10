//IMPORTI I COMPONENTI
import { NdeLocationItemComponent } from "../nde-location-item/nde-location-item.component";
import { NdePurchaseRequestCustomComponent } from "../nde-purchase-request-custom/nde-purchase-request-custom.component";
import { NdeFormRequestCustomComponent } from "../nde-form-request-custom/nde-form-request-custom.component";
import { NdeGetitMultiVolumeComponent } from "../nde-getit-multi-volume/nde-getit-multi-volume.component";
import { NdeRequestCardPurchaseComponent } from "../nde-request-card-purchase/nde-request-card-purchase.component";
import { NdeMainMenuDialogCustomComponent } from "../nde-main-menu-dialog-custom/nde-main-menu-dialog-custom.component";
import { NdeRecordActionsPermalinkComponent } from "../nde-record-actions-permalink/nde-record-actions-permalink.component";

// Define the map, attivo i componenti
export const selectorComponentMap = new Map<string, any>([
    //aggiunge la scritta "Per sola consultazione" agli articoli:
    //['nde-location-bottom', NdeLocationComponentComponent],
    //sostituisce il "location item" mettendo non disponibile quando nella location è scritto non disponibile:
    ['nde-location-item-bottom', NdeLocationItemComponent],
    //elimina alcune voci dalla lista biblioteche del form acquisti e le riordina:
    ['nde-blank-alma-purchase-request-bottom', NdePurchaseRequestCustomComponent],
    //elimina alcune voci dalla lista biblioteche del form acquisti e le riordina:
    ['nde-base-request-form-bottom', NdePurchaseRequestCustomComponent],
    //per il form acquisti cancella il campo chooseType e nasconde citaionType,
    // per il form ILL resetta la lista biblioteche, la segna obbligatoria e la riordina:
    ['nde-formly-general-wrapper-bottom', NdeFormRequestCustomComponent],
    //elimina la request card di "proponi acquisto" per gli articoli non in catalogo:
    ['nde-request-card-top', NdeRequestCardPurchaseComponent],
    //aggiunge il link "link utili unimi" nel menu a scomparsa per smartphone:
    ['nde-main-menu-dialog-top', NdeMainMenuDialogCustomComponent],
    //aggiunge il link "permalink" nel menu in alto :
    ['nde-record-actions-top', NdeRecordActionsPermalinkComponent],
    //aggiunge la lista dei volumi nella location per le opere in più volumi:
    ['nde-get-it-top', NdeGetitMultiVolumeComponent]
]);
