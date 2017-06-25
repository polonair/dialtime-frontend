import { TransactionRepository } from '../repository/';
import { Entity } from './entity';

export class Transaction extends Entity<TransactionRepository>{
    public trid;
    public amount;
    public role;
    public open;
    public status;
    parse(data: any){ 
        this.id = data.id;
        this.trid = data.trid;
        this.amount = data.amount;
        this.role = data.role;
        this.open = new Date(data.open*1000);
        this.status = data.status;
        this.readiness = true;
    }
    update(){ super.update("transaction.get"); }
    ready(){ return (this.readiness); }    
}

/*
import { TransactionRepository } from '../repository/';
import { Entity } from './entity';

export class Transaction extends Entity<TransactionRepository>{
    update(){ super.update('transaction.get'); }
    parse(data: any){ this.readiness = true; } 
}

*/