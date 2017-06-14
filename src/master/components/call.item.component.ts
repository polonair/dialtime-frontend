import { Component, Input, } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-call-item',
    template:
    `
    <tc-placeholder *ngIf="(call == 'undefined') || (call == null) || (call && !call.ready())"></tc-placeholder>    
    <tc-container *ngIf="call && call.ready()">
    	<tc-icon class="{{ getIcon() }}"></tc-icon>
        <tc-head>
            <span>
                <tc-id>#{{ call.id }}</tc-id>
                <tc-created>{{ call.createdAt | date:"yyyy.MM.dd HH:mm:ss" }}</tc-created>
            </span>
            <span>
                <tc-number>+{{ call.route.number }}</tc-number>
                <tc-length>{{ call.length | date:"mm:ss" }}</tc-length>
            </span>
        </tc-head>
    </tc-container>
    `
})
export class CallItemComponent {
    @Input() call: model.Call;
    getIcon(){ return "income"; }
}
