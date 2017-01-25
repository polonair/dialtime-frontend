import { DemandingRepository } from '../repository/';
import { Entity } from './entity';

export class Demanding extends Entity<DemandingRepository>{
    public state;
    update(){ super.update('demanding.get'); }
    parse(data: any){ 
        this.state = data.state;
        this.readiness = true;
    } 
}
