import { AccountRepository } from '../repository/';
import { Entity } from './entity';

export class Account extends Entity<AccountRepository>{
    public balance;
    public holdin;
    public holdout;
    public credit;
    
    parse(data: any)
    {
        this.balance = data.balance;
        this.holdin = data.holdin;
        this.holdout = data.holdout;
        this.credit = data.credit;
        this.readiness = true;
    }
    update(){ super.update("account.get"); }
    ready(){ return (this.readiness); }
}
