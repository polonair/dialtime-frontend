/*
@Component({
	selector: 'tc-finances',
    template:
    `
    <tc-placeholder *ngIf="(transactions == 'undefined') || (transactions == null) || (transactions.length < 1)"></tc-placeholder>
    <tc-transaction-list [transactions]="transactions" #list></tc-transaction-list>
    `
})
export class FinanceComponent{
	private transactions: model.Transaction[];
    private accounts: model.Account[];
	private length = 20;
    private expanded = false;
    private fillUpWindow = null;
    constructor(
        private interractor: services.InterractorService,
        private datarepo: model.DataRepository) { }
    ngOnInit(){
        this.interractor.title = 'Финансы';
    	this.transactions = <model.Transaction[]>this.datarepo.get('transaction', ['~' + this.length ]);
        this.accounts = <model.Account[]>this.datarepo.get('account', "main");
    }
    toggle(){
        this.expanded = !this.expanded;
    }
}
*/
