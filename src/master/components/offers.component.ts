import { 
    Component, 
    OnInit, 
} from '@angular/core';

import * as services from '../services';
import * as model from '../model';



@Component({
    selector: 'tc-offers',
    template:
    `
    <tc-placeholder *ngIf="showPlaceholder()"></tc-placeholder>
    <tc-nothing *ngIf="showNothing()">пусто</tc-nothing>
    <tc-offer-list [offers]="offers" #list></tc-offer-list>
    <tc-new-offer #new_offer></tc-new-offer>
    <tc-new-offer-button (click)="new_offer.toggle()"></tc-new-offer-button>
    `
})
export class OffersComponent implements OnInit {
    private offers: model.Offer[] = null;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Предложения';
        this.interractor.position = 'offers';
        this.offers = <model.Offer[]>this.datarepo.get('offer', ['*']);
    }
    showPlaceholder(){ return !this.datarepo.isReady('offer'); }
    showNothing(){ return (this.datarepo.isReady('offer') && (this.offers.length < 1)); }    
}