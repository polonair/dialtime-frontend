import { TransactionRepository } from '../repository/';
import { Entity } from './entity';

export class Transaction extends Entity<TransactionRepository>{
    update(){ super.update('transaction.get'); }
    parse(data: any){ this.readiness = true; } 
}
