import { 
    Component, 
    Input, 
} from '@angular/core';

import * as model from '../model';


@Component({
    selector: 'tc-route-list',
    template:
    `
    <tc-route-item *ngFor="let route of routes" [route]="route"></tc-route-item>
    `
})
export class RouteListComponent {
    @Input() routes: model.Route[] = [];
    insert(route: model.Route){
        this.routes.push(route);
    }
}