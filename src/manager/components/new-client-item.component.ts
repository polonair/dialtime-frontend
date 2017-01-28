import { Component, Input } from '@angular/core';

import * as model from '../model/';

@Component({
    selector: 'tc-new-client-item',
    template:
    `
    <tc-placeholder *ngIf="(client == 'undefined') || (client == null) || (client && !client.ready())"></tc-placeholder>    
    <tc-container *ngIf="client && client.ready() && !client.removed">
        <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
        <tc-head>
            <span>#{{ client.id }}</span>
            <span>{{ client.username }}</span>
        </tc-head>
        <tc-bind-button (click)="bindMe()"></tc-bind-button>
    </tc-container>
    `
})
export class NewClientItemComponent {
    @Input() client: model.NewClient;
    bindMe(){
        this.client.bindMe();
    }
    getIcon(){ return ""; }
}