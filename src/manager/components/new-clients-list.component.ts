import { Component, Input } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-new-clients-list',
    template: 
    `
    <tc-new-client-item *ngFor="let client of clients" [client]="client"></tc-new-client-item>
    `
})
export class NewClientsListComponent{
    @Input() clients: model.NewClient[] = [];
}
