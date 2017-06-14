import { Component } from '@angular/core';

import * as services from '../services';
import * as model from '../model';

@Component({
	selector: 'tc-calls',
    template:
    `
    <tc-placeholder *ngIf="(calls == 'undefined') || (calls == null) || (calls.length < 1)"></tc-placeholder>
    <tc-call-list [calls]="calls" #list></tc-call-list>
    `
})
export class CallsComponent{
	private calls: model.Route[];
	private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Журнал звонков';
    	this.calls = <model.Route[]>this.datarepo.get('route', ['~' + this.length]);
    } 
}
