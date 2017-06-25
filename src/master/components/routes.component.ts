import { 
    Component, 
} from '@angular/core';

import * as services from '../services';
import * as model from '../model';

@Component({
	selector: 'tc-routes',
    template:
    `
    <tc-placeholder *ngIf="(routes == 'undefined') || (routes == null) || (routes.length < 1)"></tc-placeholder>
    <tc-route-list [routes]="routes" #list></tc-route-list>
    `
})
export class RoutesComponent{
	private routes: model.Route[];
	private length = 20;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Контакты';
        this.interractor.position = 'routes';
    	this.routes = <model.Route[]>this.datarepo.get('route', ['~' + this.length]);
    } 
}