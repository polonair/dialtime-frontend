import { CallRepository } from '../repository/';
import { Entity } from './entity';

export class Call extends Entity<CallRepository>{
    public createdAt;
    public route;
    public length;
    parse(data: any){
        this.createdAt = new Date(data.createdAt*1000);
        this.route = this.repo.dataRepository.get('route', [ data.route ])[0];
        this.length = data.length*1000;
        this.readiness = true;
    }
    update(){ super.update("call.get"); }
    ready(){ return (this.readiness && this.route.ready()); }    
}
