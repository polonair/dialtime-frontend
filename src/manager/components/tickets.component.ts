import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import * as services from '../services';
import * as model from '../model/';

@Component({
    selector: 'tc-tickets',
    template: 
    `
    <tc-placeholder *ngIf="(tickets == 'undefined') || (tickets == null) || (tickets.length < 1)"></tc-placeholder>
    <tc-ticket-list [tickets]="tickets" #list></tc-ticket-list>
    <tc-more-button *ngIf="haveMore()" (click)="loadMore()">Загрузить еще</tc-more-button>
    `
})
export class TicketsComponent implements OnInit {
	private tickets: model.Ticket[];
    private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Тикеты';
    	this.tickets = <model.Ticket[]>this.datarepo.getLast('ticket', this.length);
    } 
    haveMore(){
        return (this.datarepo.getLength('ticket') > this.tickets.length);
    }
    loadMore(){
        this.length+=20;
        this.datarepo.getLast('ticket', this.length);
    }
}
