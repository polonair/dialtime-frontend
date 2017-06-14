import * as model from '../';
import { Repository } from './repository';

export class TransactionRepository extends Repository{
    private transactions_by_id = {};
    private transactions: model.Transaction[] = [];
    private loaded: model.Transaction[] = [];
    private minlength = 0;
    public ready = false;
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (args[0][0] == '~'){
            let count = parseInt(args[0].substr(1));
            this.minlength=count;
            this.update_loaded();
            return this.loaded;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.transactions.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = '_transaction_' + id;
                if (_id in this.transactions_by_id) (<model.Transaction>this.transactions_by_id[_id]).update();
                else {
                    let transaction = new model.Transaction(this, id);
                    this.transactions_by_id[_id] = transaction;
                    this.transactions.push(transaction);
                    if (!is_empty) transaction.update();
                }
            }
            this.transactions.sort((a: model.Transaction, b: model.Transaction)=>{ return b.id-a.id; });
            this.update_loaded();
        }
        this.ready = true;
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.transactions.length) break;
            let t: model.Transaction = this.transactions[i];
            if (i < this.minlength){
                this.loaded.push(t);
                if (!t.ready()) t.update();
            }
            else{
                if (t.ready()) this.loaded.push(t);
                else break;
            }
            i++;
        }
    }
    isReady(){
        return this.ready;
    }
}

/*
import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Transaction }  from '../entity';

export class TransactionRepository extends Repository{
    private categories_by_id = {};
    private categories = [];
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = 'id_' + id;
                if (_id in this.categories_by_id) result.push(this.categories_by_id[_id]);
                else{
                    let category = new Transaction(this, id);
                    this.categories_by_id[_id] = category;
                    this.categories.push(category);
                    result.push(category);
                    category.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}

*/