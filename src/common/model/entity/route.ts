import { RouteRepository } from '../repository/';
import { Entity } from './entity';

export class Route extends Entity<RouteRepository>{
    public number;
    public createdAt;
    public offer = null;
    public direct;
    public cost;
    public state;
    
    parse(data: any){
        this.number = data.number;
        this.createdAt = new Date(data.createdAt*1000);
        this.offer = this.repo.dataRepository.get('offer', [ data.offer ])[0];
        this.direct = data.direct;
        this.cost = data.cost;
        this.state = data.state;
        this.readiness = true;
    }
    update(){ super.update("route.get"); }
    ready(){ return (this.offer !=null && this.offer.ready() && this.readiness); }
    reject(reason: string){
        let reject = (r: string)=>{
            this.repo.dataRepository.api.doRequest({ action: "route.reject", data: { "route": this.id, "reason": r }}).then((r: any) => {
                if (r.result == "ok") {
                    this.readiness = false;
                    this.repo.dataRepository.forceUpdate();
                }          
            }).catch((r) => { reject(r); });
        };
        reject(reason);
    }
}

/*
import { RouteRepository } from '../repository/';
import { Entity } from './entity';

export class Route extends Entity<RouteRepository>{
    update(){ super.update('route.get'); }
    parse(data: any){ this.readiness = true; } 
}

*/