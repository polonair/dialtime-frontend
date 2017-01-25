import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Message }  from '../entity';

export class MessageRepository extends Repository{
    private items_by_id = {};
    private items = [];
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = 'id_' + id;
                if (_id in this.items_by_id) result.push(this.items_by_id[_id]);
                else{
                    let item = new Message(this, id);
                    this.items_by_id[_id] = item;
                    this.items.push(item);
                    result.push(item);
                    item.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}
