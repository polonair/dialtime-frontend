import { Component } from '@angular/core';
import { Input } from '@angular/core';

import * as model from '../model/';

@Component({
    selector: 'tc-call-list',
    template:
    `
    <tc-call-item *ngFor="let call of calls" [call]="call"></tc-call-item>
    `
})
export class CallListComponent {
    @Input() calls: model.Route[] = [];
    insert(call: model.Route){
        this.calls.push(call);
    }
}
