import { 
    Component, 
    Input, 
} from '@angular/core';
import * as model from '../model';



@Component({
    selector: 'tc-offer-list',
    template:
    `
    <tc-offer-item *ngFor="let offer of offers" [offer]="offer"></tc-offer-item>
    `
})
export class OfferListComponent {
    @Input() offers: model.Offer[] = [];
    insert(offer: model.Offer){
        this.offers.push(offer);
    }
}