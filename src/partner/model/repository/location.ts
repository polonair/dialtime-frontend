import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Location }  from '../entity';

export class LocationRepository extends Repository{
    private locations_by_id = {};
    private locations = [];
    get(args){
        if (Array.isArray(args)){
            let result = [];
            for (let id of args){
                let _id = '_location_' + id;
                if (_id in this.locations_by_id) result.push(this.locations_by_id[_id]);
                else{
                    let location = new Location(this, id);
                    this.locations_by_id[_id] = location;
                    this.locations.push(location);
                    result.push(location);
                    location.update();
                }
            }
            return result;
        }
    }
    ids(ids: number[]){ }
}
