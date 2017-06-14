import * as model from '../';
import { Repository } from './repository';

export class AccountRepository extends Repository{
    private accounts_by_id = {};
    private accounts = [];
    constructor(repo: model.DataRepository) { super(repo); }
    get(args){
        if (args == "main"){
            return this.accounts;
        }
    }
    ids(ids: number[]){
        for (let id of ids){
            let _id = '_account_' + id;
            if (_id in this.accounts_by_id) (<model.Account>this.accounts_by_id[_id]).update();
            else {
                let account = new model.Account(this, id);
                this.accounts_by_id[_id] = account;
                this.accounts.push(account);
                account.update();
            }
        }
    }
}
