import { DongleRepository } from '../repository/';
import { Entity } from './entity';

export class Dongle extends Entity<DongleRepository>{
    public number;
    update(){ super.update('dongle.get'); }
    parse(data: any){ 
        this.number = data.number;
        this.readiness = true;
    } 
}
