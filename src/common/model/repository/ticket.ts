import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Ticket }  from '../entity';

export class TicketRepository extends Repository{
    private items_by_id = {};
    private items = [];
    private loaded = [];
    private minlength = 0;
    getLength(){ return this.items.length; }
    getLast(count){
        this.minlength=count;
        this.update_loaded();
        return this.loaded;
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.items.length) break;
            let r: Ticket = this.items[i];
            if (i < this.minlength){
                this.loaded.push(r);
                if (!r.ready()) r.update();
            }
            else{
                if (r.ready()) this.loaded.push(r);
                else break;
            }
            i++;
        }
    }  
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = 'id_' + id;
                if (_id in this.items_by_id) result.push(this.items_by_id[_id]);
                else{
                    let item = new Ticket(this, id);
                    this.items_by_id[_id] = item;
                    this.items.push(item);
                    result.push(item);
                    item.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.items.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = 'id_' + id;
                if (_id in this.items_by_id) (<Ticket>this.items_by_id[_id]).update();
                else {
                    let item = new Ticket(this, id);
                    this.items_by_id[_id] = item;
                    this.items.push(item);
                    if (!is_empty) item.update();
                }
            }
            this.items.sort((a: Ticket, b: Ticket)=>{ return b.id-a.id; });
            this.update_loaded();
        }        
    }  
}
