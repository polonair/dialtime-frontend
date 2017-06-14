import { Component, Input, } from '@angular/core';
import * as model from '../model';

@Component({
    selector: 'tc-call-list',
    template:
    `
    <tc-call-item *ngFor="let call of calls" [call]="call"></tc-call-item>
    `
})
export class CallListComponent {
    @Input() calls: model.Call[] = [];
    insert(call: model.Call){
        this.calls.push(call);
    }
}