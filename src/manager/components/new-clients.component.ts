import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

import * as services from '../services';
import * as model from '../model';

@Component({
    selector: 'tc-new-clients',
    template: 
    `
    <tc-placeholder *ngIf="(clients.length < 1)"></tc-placeholder>
    <tc-new-clients-list [clients]="clients"></tc-new-clients-list>
    `
})
export class NewClientsComponent implements OnInit {
    private clients: model.NewClient[] = [];
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Свободные клиенты';
    	this.clients = <model.NewClient[]>this.datarepo.getAll('newclient');
    } 
}
