import { CallRepository } from '../repository/';
import { Entity } from './entity';

export class Call extends Entity<CallRepository>{
    update(){ super.update('call.get'); }
    parse(data: any){ this.readiness = true; } 
}
