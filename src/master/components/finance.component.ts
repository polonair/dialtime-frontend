import { 
    Component, 
} from '@angular/core';

import * as services from '../services';
import * as model from '../model';

@Component({
	selector: 'tc-finances',
    template:
    `
    <tc-account>
        <tc-placeholder *ngIf="(accounts == 'undefined') || (accounts == null) || (accounts.length < 1) || (accounts.length > 0 && (accounts[0] == null || !accounts[0].ready()))"></tc-placeholder>
        <tc-container *ngIf="accounts && accounts.length > 0 && accounts[0] && accounts[0].ready()">
            <tc-info (click)="toggle()">
                <tc-head>Текущее состояние счета #{{ accounts[0].id }}</tc-head>
                <tc-current>
                    <span>Баланс </span>
                    <span>{{ accounts[0].balance }} руб.</span>
                </tc-current>
                <tc-hold-in [class.shown]="accounts[0].holdin != 0">
                    <span>Ожидается поступление </span>
                    <span>{{ accounts[0].holdin }} руб.</span>
                </tc-hold-in>
                <tc-hold-out [class.shown]="accounts[0].holdout != 0">
                    <span>Ожидается списание </span>
                    <span>{{ accounts[0].holdout }} руб.</span>
                </tc-hold-out>
                <tc-credit [class.shown]="accounts[0].credit != 0">
                    <span>Кредитный лимит </span>
                    <span>{{ accounts[0].credit }} руб.</span>
                </tc-credit>
                <tc-link>Пополнить счет</tc-link>
            </tc-info>
            <tc-fillup [class.expanded]="expanded">
                <tc-amount>
                    <span>Введите сумму </span>
                    <input type="text" #amount>
                    <span>руб. </span>
                </tc-amount>
                <tc-buttons>
                    <tc-ok (click)="go(amount.value)"><tc-icon></tc-icon> Оплатить</tc-ok>
                    <tc-cancel (click)="toggle()"><tc-icon></tc-icon> Отмена</tc-cancel>
                </tc-buttons>
            </tc-fillup>
        </tc-container>
    </tc-account>
    <tc-placeholder *ngIf="showPlaceholder()"></tc-placeholder>
    <tc-nothing *ngIf="showNothing()">пусто</tc-nothing>
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
        this.interractor.position = 'finances';
    	this.transactions = <model.Transaction[]>this.datarepo.get('transaction', ['~' + this.length ]);
        this.accounts = <model.Account[]>this.datarepo.get('account', "main");
    }
    toggle(){
        this.expanded = !this.expanded;
    }
    go(value){
        this.datarepo.api.doRequest({action:"fillup.get.link", data: { amount: value, provider: "robokassa" }}).then((r: any)=>{
            if (r.result == 'ok'){
                this.toggle();
                this.fillUpWindow =  window.open(r.data.link);
            }
        });
    }
    showPlaceholder(){ return !this.datarepo.isReady('transaction'); }
    showNothing(){ return (this.datarepo.isReady('transaction') && (this.transactions.length < 1)); } 
}