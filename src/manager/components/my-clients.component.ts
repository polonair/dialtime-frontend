import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import * as services from '../services';
import * as model from '../model/';


@Component({
    selector: 'tc-my-clients',
    template: 
    `
    <tc-placeholder *ngIf="(clients == 'undefined') || (clients == null) || (clients.length < 1)"></tc-placeholder>
    <tc-my-client-list [clients]="clients"></tc-my-client-list>
    <tc-more-button *ngIf="haveMore()" (click)="loadMore()">Еще</tc-more-button>
    `
})
export class MyClientsComponent implements OnInit {
    private clients: model.MyClient[];
    private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Мои клиенты';
    	this.clients = <model.MyClient[]>this.datarepo.getLast('myclient', this.length);
    } 
    haveMore(){
        return (this.datarepo.getLength('myclient') > this.clients.length);
    }
    loadMore(){
        this.length += 20;
        this.datarepo.getLast('myclient', this.length);
    }
}