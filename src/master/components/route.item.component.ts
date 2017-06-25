import { 
    Component, 
    Input, 
} from '@angular/core';
import { Router } from '@angular/router';

import * as model from '../model';

@Component({
    selector: 'tc-route-item',
    template:
    `
    <tc-placeholder *ngIf="(route == 'undefined') || (route == null) || (route && !route.ready())"></tc-placeholder>    
    <tc-container *ngIf="route && route.ready()">
        <tc-control>
            <tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
            <tc-head (click)="toggle()">
                <span>
                    <tc-id>#{{ route.id }}</tc-id>
                    <tc-created>{{ route.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</tc-created>
                </span>
                <span>
                    <tc-number>+{{ route.number }}</tc-number>
                </span>
            </tc-head>
        </tc-control>
    </tc-container>
    `
})
export class RouteItemComponent {
    @Input() route: model.Route;
    constructor(private router: Router){}
    toggle(){
    	this.router.navigate(['/dashboard/route', this.route.id]);
    }
    getIcon(){
    	return this.route.state;
    }
}