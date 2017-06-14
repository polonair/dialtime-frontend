import { LocationRepository } from '../repository/';
import { Entity } from './entity';

export class Location extends Entity<LocationRepository>{
    public name;
    public children;
    public locative;
    update(){ super.update('location.get'); }
    parse(data: any){ 
        this.name = data.name;
        this.locative = data.locative;
        this.children = data.children;
        this.readiness = true;
    } 
}
