import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { NewClient }  from '../entity';

export class NewClientRepository extends Repository{
    private items_by_id = {};
    private items = [];
    get(args){ return []; }
    getAll(){ return this.items; }
    ids(ids: number[]){
        let is_empty = (this.items.length == 0);
        for(let item of this.items) item.removed = true;
        for (let id of ids){
            let _id = 'id_' + id;
            if (_id in this.items_by_id) this.items_by_id[_id].removed = false;
            else {
                let item = new NewClient(this, id);
                this.items_by_id[_id] = item;
                this.items.push(item);
                item.update();
            }
        }
        for(let item of this.items){
            if (item.removed){
                delete this.items_by_id['id_' + item.id];
            }
        }
        this.items.splice(0, this.items.length);
        for(let item_id in this.items_by_id) this.items.push(this.items_by_id[item_id]);
    }
}
