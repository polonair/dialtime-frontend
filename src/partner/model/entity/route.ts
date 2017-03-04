import { RouteRepository } from '../repository/';
import { Entity } from './entity';

export class Route extends Entity<RouteRepository>{
    update(){ super.update('route.get'); }
    parse(data: any){ this.readiness = true; } 
}
