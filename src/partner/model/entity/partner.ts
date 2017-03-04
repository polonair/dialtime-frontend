import { PartnerRepository } from '../repository/';
import { Entity } from './entity';

export class Partner extends Entity<PartnerRepository>{
    update(){ super.update('partner.get'); }
    parse(data: any){ this.readiness = true; } 
}
