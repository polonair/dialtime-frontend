import { Repository } from './repository';
import { DataRepository } from './data.repository';

import { Route }  from '../entity';

export class RouteRepository extends Repository{
    private calls_by_id = {};
    private calls: Route[] = [];
    private loaded: Route[] = [];
    private minlength = 0;
    get(args){
        if (args[0][0] == '~'){
            let count = parseInt(args[0].substr(1));
            this.minlength=count;
            this.update_loaded();
            return this.loaded;
        }
    }
    ids(ids: number[]){
        let is_empty = (this.calls.length == 0);
        if (ids.length > 0)
        {
            for (let id of ids){
                let _id = '_call_' + id;
                if (_id in this.calls_by_id) (<Route>this.calls_by_id[_id]).update();
                else {
                    let route = new Route(this, id);
                    this.calls_by_id[_id] = route;
                    this.calls.push(route);
                    if (!is_empty) route.update();
                }
            }
            this.calls.sort((a: Route, b: Route)=>{ return b.id-a.id; });
            this.update_loaded();
        }
    }
    update_loaded(){
        this.loaded.length = 0;
        let i = 0;
        while(true){
            if (i>= this.calls.length) break;
            let r: Route = this.calls[i];
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
}
