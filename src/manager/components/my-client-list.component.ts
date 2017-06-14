import { Component, Input } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-my-client-list',
    template: 
    `
    <tc-my-client-item *ngFor="let client of clients" [client]="client"></tc-my-client-item>
    `
})
export class MyClientListComponent {
    @Input() clients: model.MyClient[] = [];    
}
