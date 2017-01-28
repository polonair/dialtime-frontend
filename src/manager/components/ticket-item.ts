import { Component, Input } from '@angular/core';
import { Router  } from '@angular/router';

import * as model from '../model/';

@Component({
    selector: 'tc-ticket-item',
    template:
    `
    <tc-placeholder *ngIf="(ticket == 'undefined') || (ticket == null) || (ticket && !ticket.ready())"></tc-placeholder>    
    <tc-container *ngIf="ticket && ticket.ready()" (click)="router.navigate(['/dashboard/ticket', ticket.id])">
        <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
        <tc-head>
            <tc-info>
                <span>{{ ticket.created | date:"yyyy.MM.dd HH:mm:ss" }}</span>
                <span class="{{ getClientStyle() }}">клиент #{{ ticket.client.id }}</span>
            </tc-info>
            <tc-theme>
                <span>#{{ ticket.id }}</span>
                <span>{{ ticket.theme }}</span>
            </tc-theme>
        </tc-head>
    </tc-container>
    `
})
export class TicketItemComponent {
    @Input() ticket: model.Ticket;
	constructor(private router: Router){}
    getIcon(){ return ""; }
    getClientStyle(){ return ""; }
}