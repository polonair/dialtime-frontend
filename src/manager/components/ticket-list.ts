import { Component, Input } from '@angular/core';

import * as model from '../model/';

@Component({
    selector: 'tc-ticket-list',
    template: 
    `
    <tc-ticket-item *ngFor="let ticket of tickets" [ticket]="ticket"></tc-ticket-item>
    `
})
export class TicketListComponent {
    @Input() tickets: model.Ticket[] = [];    
}
