import { Component } from '@angular/core';
import { Input } from '@angular/core';

import * as model from '../model/';

@Component({
    selector: 'tc-campaign-item',
    template:
    `
    <tc-item-container *ngIf="(campaign == 'undefined') || (campaign == null) || (campaign && !campaign.ready()) || (campaign && campaign.ready() && !campaign.removed)">
        <tc-placeholder *ngIf="(campaign == 'undefined') || (campaign == null) || (campaign && !campaign.ready())"></tc-placeholder>
        <tc-container *ngIf="campaign && campaign.ready()" #container>
            <tc-control [class.expanded]="expanded">
                <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
                <tc-id>#{{ campaign.id }}</tc-id>
                <tc-head (click)="toggle()">
                    <tc-text>{{ campaign.category.name }}<br/>{{ campaign.location.locative }}</tc-text>
                </tc-head>
            </tc-control>
            <tc-body [class.expanded]="expanded">
                <tc-brief>
                    <tc-category>
                        <span>Категория </span>
                        <span>{{ campaign.category.name }}</span>
                    </tc-category>
                    <tc-location>
                        <span>Регион </span>
                        <span>{{ campaign.location.name }}</span>
                    </tc-location>
                    <tc-bid>
                        <span>Цена </span>
                        <span>
                            <tc-show [class.shown]="!bid_edit" (click)="toggle_bid()">
                                <span>до {{ campaign.bid }} руб.</span>
                                <tc-pencil></tc-pencil>
                            </tc-show>
                            <tc-edit [class.shown]="bid_edit">
                                <input type="text" value="{{ campaign.bid }}" #bidInput>
                                <tc-buttons>
                                    <tc-ok (click)="save_bid(bidInput.value)">
                                        <tc-icon></tc-icon> Сохранить
                                    </tc-ok>
                                    <tc-cancel (click)="toggle_bid()">
                                        <tc-icon></tc-icon> Отмена
                                    </tc-cancel>
                                </tc-buttons>
                            </tc-edit>
                        </span>
                    </tc-bid>
                </tc-brief>
                <tc-dongles>
                    <tc-dongle *ngFor="let dongle of campaign.dongles">{{ dongle.number }}</tc-dongle>
                    <tc-demanding *ngFor="let demanding of campaign.active_demandings">{{ demanding.state }}</tc-demanding>
                    <tc-demand *ngIf="campaign.active_demandings.length < 1" (click)="demand()">
                        <tc-button *ngIf="campaign.dongles.length < 1">Получить номер</tc-button>
                        <tc-button *ngIf="campaign.dongles.length > 0">Получить еще один номер</tc-button>
                    </tc-demand>
                </tc-dongles>
            </tc-body>
        </tc-container>
    </tc-item-container>
    `
})
export class CampaignItemComponent {
    private expanded = false;
    @Input() campaign: model.Campaign;
    getIcon(){ return ""; }
    toggle(){ this.expanded = !this.expanded; }
    demand(){
        this.campaign.demand();
    }
}
