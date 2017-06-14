import { Component, Input } from '@angular/core';

import * as model from '../model';

@Component({
    selector: 'tc-transaction-list',
    template:
    `
    <tc-transaction-item *ngFor="let transaction of transactions" [transaction]="transaction"></tc-transaction-item>
    `
})
export class TransactionListComponent {
    @Input() transactions: model.Transaction[] = [];
    insert(transaction: model.Transaction){
        this.transactions.push(transaction);
    }
}