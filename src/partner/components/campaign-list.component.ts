import { Component } from '@angular/core';
import { Input } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-campaign-list',
    template:
    `
    <tc-campaign-item *ngFor="let campaign of campaigns" [campaign]="campaign"></tc-campaign-item>
    `
})
export class CampaignListComponent {
    @Input() campaigns: model.Campaign[] = [];
    insert(campaign: model.Campaign){
        this.campaigns.push(campaign);
    }
}
