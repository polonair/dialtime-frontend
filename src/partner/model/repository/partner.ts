import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Partner }  from '../entity';

export class PartnerRepository extends Repository{
    private categories_by_id = {};
    private categories = [];
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = 'id_' + id;
                if (_id in this.categories_by_id) result.push(this.categories_by_id[_id]);
                else{
                    let category = new Partner(this, id);
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
