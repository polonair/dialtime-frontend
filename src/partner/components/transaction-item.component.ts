/*
@Component({
    selector: 'tc-transaction-item',
    template:
    `
    <tc-placeholder *ngIf="(transaction == 'undefined') || (transaction == null) || (transaction && !transaction.ready())"></tc-placeholder>
    <tc-container *ngIf="transaction && transaction.ready()">
    	<tc-item-icon class="{{ getIcon() }}"></tc-item-icon>
        <tc-head>
            <span>
                <tc-id>#{{ transaction.id }}/{{ transaction.trid }}</tc-id>
                <tc-time-open>{{ transaction.open | date:"yyyy.MM.dd HH:mm:ss" }}</tc-time-open>
            </span>
            <span>
                <tc-amount>{{ transaction.amount }} руб.</tc-amount>
            </span>
        </tc-head>
    </tc-container>
    `
})
export class TransactionItemComponent {
    @Input() transaction: model.Transaction;
    getIcon(){ return ""; }
}
*/
