import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import * as services from '../services';
import * as model from '../model';

@Component({
    selector: 'tc-campaigns',
    template:
    `
    <tc-placeholder *ngIf="showPlaceholder()"></tc-placeholder>
    <tc-nothing *ngIf="showNothing()">пусто</tc-nothing>
    <tc-campaign-list [campaigns]="campaigns" #list></tc-campaign-list>
    <tc-new-campaign #new_offer></tc-new-campaign>
    <tc-new-campaign-button (click)="new_offer.toggle()"></tc-new-campaign-button>
    `
})
export class CampaignsComponent implements OnInit {
	private campaigns: model.Campaign[] = null;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Кампании';
    	this.campaigns = <model.Campaign[]>this.datarepo.get('campaign', ['*']);
    }
    showPlaceholder(){ return !this.datarepo.isReady('campaign'); }
    showNothing(){ return (this.datarepo.isReady('campaign') && (this.campaigns.length < 1)); }
}
