import { Component, Input } from '@angular/core';
import { Router  } from '@angular/router';

import * as model from '../model';

@Component({
    selector: 'tc-my-client-item',
    template:
    `
    <tc-placeholder *ngIf="(client == 'undefined') || (client == null) || (client && !client.ready())"></tc-placeholder>    
    <tc-container *ngIf="client && client.ready()" (click)="router.navigate(['/dashboard/client', client.id])">
        <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
        <tc-head>
            <span>#{{ client.id }}</span>
            <span>{{ client.username }}</span>
        </tc-head>
    </tc-container>
    `
})
export class MyClientItemComponent {
    @Input() client: model.MyClient;
	constructor(private router: Router){}
    getIcon(){ return ""; }
}